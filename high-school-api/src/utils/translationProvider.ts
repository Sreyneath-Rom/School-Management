// src/utils/translationProvider.ts
//
// Thin wrapper around a machine-translation provider, used by the
// "auto-translate missing keys" feature in the translations module.
//
// Ships against MyMemory (https://mymemory.translated.net) because it's
// free and requires no API key or account — good for getting a school's
// admin unblocked without a billing setup. Quality is machine-translation
// quality: fine as a starting draft an admin then reviews/edits by hand,
// not a substitute for human review on anything user-facing and
// sensitive. Swap `translateOne`'s implementation for Google Cloud
// Translation, DeepL, or Azure Translator later without touching the
// service/controller/route layer above it — they only call `translateBatch`.

const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'

// MyMemory's free tier is rate-limited per IP/day and doesn't like being
// hammered concurrently. Translating sequentially with a small delay is
// slower but far less likely to trip 429s than firing 100 requests at once.
const REQUEST_DELAY_MS = 200

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface TranslateEntry {
  key: string
  text: string
}

export interface TranslateResult {
  key: string
  translated: string | null // null = this one failed; caller should skip it, not overwrite with garbage
}

async function translateOne(text: string, targetCode: string): Promise<string | null> {
  const params = new URLSearchParams({
    q: text,
    langpair: `en|${targetCode}`,
  })

  try {
    const res = await fetch(`${MYMEMORY_ENDPOINT}?${params.toString()}`)
    if (!res.ok) return null

    const body = (await res.json()) as {
      responseStatus?: number | string
      responseData?: { translatedText?: string }
    }

    // MyMemory returns HTTP 200 even on internal failure/quota errors,
    // with the real status inside the body — checking res.ok alone isn't
    // enough here.
    if (String(body.responseStatus) !== '200') return null

    const translated = body.responseData?.translatedText
    if (!translated || typeof translated !== 'string') return null

    return translated
  } catch {
    return null
  }
}

/**
 * Translates each entry from English into `targetCode` (an ISO-ish
 * language code, e.g. "km", "fr"). Runs sequentially with a short delay
 * between calls to stay within the free provider's rate limits. Entries
 * that fail translate to `null` rather than throwing, so one bad/rate-limited
 * call doesn't take down the whole batch.
 */
export async function translateBatch(
  entries: TranslateEntry[],
  targetCode: string
): Promise<TranslateResult[]> {
  const results: TranslateResult[] = []

  for (const entry of entries) {
    const translated = await translateOne(entry.text, targetCode)
    results.push({ key: entry.key, translated })

    if (entry !== entries[entries.length - 1]) {
      await delay(REQUEST_DELAY_MS)
    }
  }

  return results
}