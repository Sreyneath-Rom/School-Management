/**
 * Escape a string for use in a regular expression.
 *
 * Extracted because `highlightSearchTerm` needs it — a search term like
 * `(` throws `SyntaxError: Invalid regular expression`, and a term like
 * `.*` matches everything.
 */
export const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Escape a string for HTML text context.
 *
 * Turns `<script>` into `&lt;script&gt;`. Correct for text interpolation —
 * do NOT use on a string you then feed to `dangerouslySetInnerHTML` and
 * expect to render as HTML.
 *
 * For untrusted HTML, use a real sanitizer (DOMPurify). This is not one.
 */
export const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Generate a URL slug from a string.
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Strip HTML tags from a string.
 *
 * For display-only use — this is not a sanitizer. A malformed tag like
 * `<img src=x onerror=alert(1)` without the closing `>` will survive.
 * Anything security-sensitive needs DOMPurify.
 */
export const stripHTMLTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Encode a UTF-8 string as Base64.
 *
 * Uses `TextEncoder` instead of the deprecated `escape(encodeURIComponent(...))`
 * pattern — the deprecated path mishandles astral-plane characters (emoji).
 */
export const toBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
};

/**
 * Decode a Base64 string as UTF-8.
 */
export const fromBase64 = (str: string): string => {
  const binary = atob(str);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/**
 * Generate a random alphanumeric string.
 *
 * Uses `crypto.getRandomValues` when available so the output is
 * cryptographically random — suitable for tokens and nonces. `Math.random()`
 * is only the last resort for very old runtimes; it is not cryptographically
 * random.
 *
 * `globalThis.crypto` is used instead of the bare `crypto` identifier
 * because the bare one resolves differently depending on which TypeScript
 * `lib` files are loaded (DOM declares it as `Crypto`; Node-only setups
 * don't declare the global at all). `globalThis.crypto` resolves through a
 * single declaration and typechecks under stricter configurations.
 */
export const generateRandomString = (length = 10): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const c = globalThis.crypto;

  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(length);
    c.getRandomValues(bytes);
    let out = '';
    for (let i = 0; i < length; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  }

  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};

/**
 * Generate a v4 UUID.
 *
 * Prefers `crypto.randomUUID` (Node 14.17+, all modern browsers), falls back
 * to a `getRandomValues` implementation per RFC 4122, and only uses
 * `Math.random()` if the environment has neither — a UUID-shaped string
 * with weak entropy, not appropriate for anything the backend relies on
 * for security.
 */
export const generateUUID = (): string => {
  const c = globalThis.crypto;

  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }

  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    // Set version (4) and variant (10xx) bits per RFC 4122.
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(
      ''
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Count words in a string.
 *
 * Returns 0 for whitespace-only input — the old version returned 1 because
 * `''.trim().split(/\s+/).length` is `1`.
 */
export const countWords = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
};

/**
 * Reverse a string.
 *
 * Uses `Array.from` instead of `.split('')` so astral-plane characters
 * (emoji, some CJK) don't get split in half.
 */
export const reverseString = (str: string): string => {
  return Array.from(str).reverse().join('');
};

/**
 * Check whether a string reads the same forwards and backwards, ignoring
 * non-alphanumeric characters and case.
 */
export const isPalindrome = (str: string): boolean => {
  const cleaned = str.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return cleaned === reverseString(cleaned);
};

/**
 * Highlight occurrences of a search term in a string.
 *
 * Returns HTML with `<mark>` wrapping each match. Safe against:
 *   - A `term` that's a regex metacharacter (`(`, `[`, `.`) — escaped.
 *   - A `term` or `text` containing `<`, `>`, `&` — HTML-escaped.
 *
 * Only use with `dangerouslySetInnerHTML` on a string you control. If you
 * can avoid `dangerouslySetInnerHTML` entirely by rendering segments with
 * a component, prefer that — it eliminates this class of bug rather than
 * patching it.
 */
export const highlightSearchTerm = (
  text: string,
  term: string,
  className = 'highlight'
): string => {
  if (!term) return escapeHtml(text);

  const safeClass = escapeHtml(className);
  const pattern = new RegExp(`(${escapeRegex(term)})`, 'gi');

  // Split first, then escape parts — interpolating a raw string into a
  // replacement would mis-handle `$1` sequences that appear in the source.
  return text
    .split(pattern)
    .map((part, i) =>
      i % 2 === 1
        ? `<mark class="${safeClass}">${escapeHtml(part)}</mark>`
        : escapeHtml(part)
    )
    .join('');
};

/**
 * Split a string on any of the given delimiters.
 */
export const splitByDelimiters = (
  str: string,
  delimiters: string[]
): string[] => {
  const pattern = delimiters.map(escapeRegex).join('');
  const regex = new RegExp(`[${pattern}]`);
  return str.split(regex).filter((s) => s);
};

/**
 * Extract the substring between two markers.
 *
 * Returns an empty string when either marker is missing, rather than the
 * accidental output of `slice(-1, ...)` on the old implementation.
 */
export const getStringBetween = (
  str: string,
  start: string,
  end: string
): string => {
  const startIndex = str.indexOf(start);
  if (startIndex === -1) return '';
  const from = startIndex + start.length;
  const endIndex = str.indexOf(end, from);
  if (endIndex === -1) return '';
  return str.slice(from, endIndex);
};

/**
 * Apply a set of replacements to a string.
 *
 * Keys are treated as literal substrings, not regex — a key like `"a.b"`
 * matches the literal `a.b`, not any character followed by `b`.
 */
export const replaceMultiple = (
  str: string,
  replacements: Record<string, string>
): string => {
  let result = str;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(key).join(value);
  }
  return result;
};

/**
 * Test a string against a glob-like pattern where `*` matches any run of
 * characters. All other characters are treated literally.
 */
export const matchPattern = (str: string, pattern: string): boolean => {
  const regexSource = escapeRegex(pattern).replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexSource}$`);
  return regex.test(str);
};