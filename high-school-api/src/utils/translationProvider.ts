// Thin wrapper around a machine-translation provider, used by the
// "auto-translate missing keys" feature in the translations module.
//
// Ships against MyMemory (https://mymemory.translated.net) because it's free
// and requires no API key — good for getting a school's admin unblocked
// without a billing setup. Quality is machine-translation quality: fine as a
// starting draft an admin then reviews and edits by hand, not a substitute
// for human review on anything user-facing and sensitive.
//
// Swap `translateOne`'s implementation for Google Cloud Translation, DeepL,
// or Azure Translator later without touching the service/controller/route
// layer above it — they only call `translateBatch`.

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'

// MyMemory's free tier is rate-limited per IP/day and doesn't like being
// hammered concurrently. Translating sequentially with a small delay is
// slower but far less likely to trip 429s than firing 100 requests at once.
const REQUEST_DELAY_MS = 200

// Per-request timeout. Without this, a single hung MyMemory request blocks
// the entire sequential loop indefinitely.
const REQUEST_TIMEOUT_MS = 10_000

// Hard cap on batch size. Prevents a caller from accidentally queueing an
// hours-long translation job when a schema change adds a hundred new keys.
export const MAX_BATCH_SIZE = 100

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface TranslateEntry {
  key: string
  text: string
}

export interface TranslateResult {
  key: string
  /** null = this entry failed; caller must skip it rather than overwrite with garbage. */
  translated: string | null
}

async function translateOne(
  text: string,
  targetCode: string
): Promise<string | null> {
  const params = new URLSearchParams({
    q: text,
    langpair: `en|${targetCode}`,
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${MYMEMORY_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    })
    if (!res.ok) return null

    const body = (await res.json()) as {
      responseStatus?: number | string
      responseData?: { translatedText?: string }
    }

    // MyMemory returns HTTP 200 even on internal failure or quota errors,
    // with the real status inside the body — checking res.ok alone isn't
    // enough.
    if (String(body.responseStatus) !== '200') return null

    const translated = body.responseData?.translatedText
    if (!translated || typeof translated !== 'string') return null

    return translated
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Translates each entry from English into `targetCode` (an ISO-ish language
 * code, e.g. "km", "fr"). Runs sequentially with a short delay between calls
 * to stay within the free provider's rate limits. Entries that fail translate
 * to `null` rather than throwing, so one bad or rate-limited call doesn't
 * take down the whole batch.
 */
export async function translateBatch(
  entries: TranslateEntry[],
  targetCode: string
): Promise<TranslateResult[]> {
  if (entries.length > MAX_BATCH_SIZE) {
    throw new Error(
      `translateBatch: refused ${entries.length} entries (max ${MAX_BATCH_SIZE}). Split the batch.`
    )
  }

  const results: TranslateResult[] = []

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const translated = await translateOne(entry.text, targetCode)
    results.push({ key: entry.key, translated })

    // Skip the trailing delay after the last entry.
    if (i < entries.length - 1) {
      await delay(REQUEST_DELAY_MS)
    }
  }

  return results
}