/**
 * Generate slug from string
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
 * Sanitize HTML string
 */
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Strip HTML tags
 */
export const stripHTMLTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Convert string to URL-safe base64
 */
export const toBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Decode URL-safe base64
 */
export const fromBase64 = (str: string): string => {
  return decodeURIComponent(escape(atob(str)));
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Count words in string
 */
export const countWords = (str: string): number => {
  return str.trim().split(/\s+/).length;
};

/**
 * Reverse string
 */
export const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Check if string is palindrome
 */
export const isPalindrome = (str: string): boolean => {
  const cleaned = str.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return cleaned === reverseString(cleaned);
};

/**
 * Highlight search term in string
 */
export const highlightSearchTerm = (
  text: string,
  term: string,
  className = 'highlight'
): string => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, `<mark class="${className}">$1</mark>`);
};

/**
 * Split string by multiple delimiters
 */
export const splitByDelimiters = (str: string, delimiters: string[]): string[] => {
  const regex = new RegExp(`[${delimiters.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`);
  return str.split(regex).filter((s) => s);
};

/**
 * Get string between two strings
 */
export const getStringBetween = (
  str: string,
  start: string,
  end: string
): string => {
  const startIndex = str.indexOf(start) + start.length;
  const endIndex = str.indexOf(end, startIndex);
  return str.slice(startIndex, endIndex);
};

/**
 * Replace multiple values
 */
export const replaceMultiple = (
  str: string,
  replacements: Record<string, string>
): string => {
  let result = str;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  return result;
};

/**
 * Escape special regex characters
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Match string pattern
 */
export const matchPattern = (str: string, pattern: string): boolean => {
  const regex = new RegExp(`^${escapeRegex(pattern).replace(/\*/g, '.*')}$`);
  return regex.test(str);
};
