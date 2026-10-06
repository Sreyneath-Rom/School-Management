const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get'

const REQUEST_DELAY_MS = 200
const REQUEST_TIMEOUT_MS = 10_000

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

    if (i < entries.length - 1) {
      await delay(REQUEST_DELAY_MS)
    }
  }

  return results
}