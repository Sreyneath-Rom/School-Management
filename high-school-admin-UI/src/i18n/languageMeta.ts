// ============================================================================
// LANGUAGE METADATA
//
// Single source of truth for flag/locale lookups. Previously this map was
// duplicated in Header.tsx and TranslationManager.tsx with different entries
// (Header was missing sk, bg, is, ga, ca, mx, br, mi) which meant the same
// language code could render a different flag depending on which component
// rendered it. Keeping one map removes that class of bug entirely.
// ============================================================================

const FLAGS_BY_CODE: Record<string, string> = {
  // Europe
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  it: '🇮🇹',
  pt: '🇵🇹',
  nl: '🇳🇱',
  ru: '🇷🇺',
  uk: '🇺🇦',
  pl: '🇵🇱',
  ro: '🇷🇴',
  hu: '🇭🇺',
  cs: '🇨🇿',
  sk: '🇸🇰',
  bg: '🇧🇬',
  el: '🇬🇷',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  is: '🇮🇸',
  ga: '🇮🇪',

  // Asia
  km: '🇰🇭',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  th: '🇹🇭',
  vi: '🇻🇳',
  my: '🇲🇲',
  id: '🇮🇩',
  ms: '🇲🇾',
  tl: '🇵🇭',
  ph: '🇵🇭',
  hi: '🇮🇳',
  bn: '🇧🇩',
  ur: '🇵🇰',
  ne: '🇳🇵',
  si: '🇱🇰',
  lo: '🇱🇦',
  mn: '🇲🇳',

  // Middle East
  ar: '🇸🇦',
  he: '🇮🇱',
  fa: '🇮🇷',
  tr: '🇹🇷',

  // Americas
  ca: '🇨🇦',
  mx: '🇲🇽',
  br: '🇧🇷',

  // Oceania
  mi: '🇳🇿',
}

const LOCALES_BY_CODE: Record<string, string> = {
  en: 'en-US',
  km: 'km-KH',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  th: 'th-TH',
  vi: 'vi-VN',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  ru: 'ru-RU',
  ar: 'ar-SA',
  hi: 'hi-IN',
  id: 'id-ID',
  ms: 'ms-MY',
  tl: 'fil-PH',
  tr: 'tr-TR',
  nl: 'nl-NL',
  pl: 'pl-PL',
  uk: 'uk-UA',
  sv: 'sv-SE',
  no: 'nb-NO',
  da: 'da-DK',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  ro: 'ro-RO',
  hu: 'hu-HU',
  el: 'el-GR',
  he: 'he-IL',
  my: 'my-MM',
  lo: 'lo-LA',
  ne: 'ne-NP',
  si: 'si-LK',
  bn: 'bn-BD',
  ur: 'ur-PK',
  fa: 'fa-IR',
  mn: 'mn-MN',
  sk: 'sk-SK',
  bg: 'bg-BG',
  is: 'is-IS',
  ga: 'ga-IE',
  ca: 'en-CA',
  mx: 'es-MX',
  br: 'pt-BR',
  mi: 'mi-NZ',
}

export function getFlagFromLanguageCode(code: string): string {
  return FLAGS_BY_CODE[code.toLowerCase()] ?? '🌐'
}

export function getLocaleFromCode(code: string): string {
  const normalized = code.toLowerCase()
  return LOCALES_BY_CODE[normalized] ?? `${normalized}-${normalized.toUpperCase()}`
}

export function slugifyCode(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z]/g, '').slice(0, 5) || 'xx'
}

export function isValidLanguageCode(code: string): boolean {
  return /^[a-z]{2,5}$/i.test(code)
}