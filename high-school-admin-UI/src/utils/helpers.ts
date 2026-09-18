/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalize the first letter of every word.
 */
export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Convert a string to kebab-case.
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();
};

/**
 * Convert a string to snake_case.
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2')
    .toLowerCase();
};

/**
 * Convert a string to camelCase.
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

/**
 * Deep-clone a value.
 *
 * Uses the native `structuredClone` when available — it handles `Date`,
 * `Map`, `Set`, and circular references correctly, unlike the
 * `JSON.parse(JSON.stringify(...))` fallback which drops dates to strings
 * and throws on circular structures.
 *
 * Prefer `structuredClone` for any input that isn't a plain JSON shape.
 */
export const deepClone = <T>(obj: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * Merge a list of partial objects into one. Later objects override earlier
 * keys. Shallow — nested objects are not deeply merged.
 *
 * Uses `Object.assign` because its signature (`<T, U>(target: T, source: U):
 * T & U`) matches what a shallow merge actually does. A spread-based reducer
 * accumulates `Partial<T>`, and TypeScript refuses to widen that back to `T`
 * in the return position.
 *
 * The return type is `T`, but nothing verifies the inputs collectively
 * supply every required field of `T`. That's the caller's contract: pass at
 * least one object carrying each required field, or the merged value will
 * be missing them at runtime despite the type saying otherwise.
 */
export const mergeObjects = <T extends Record<string, unknown>>(
  ...objects: Partial<T>[]
): T => {
  return Object.assign({}, ...objects) as T;
};

/**
 * Pick a random element from a non-empty array.
 */
export const getRandomElement = <T>(arr: readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Return a shuffled copy of an array (Fisher-Yates).
 */
export const shuffleArray = <T>(arr: readonly T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Return a copy of an array with duplicates removed.
 *
 * Uses reference equality for objects — for value-based deduping on a key,
 * see `groupBy` or dedupe manually.
 */
export const removeDuplicates = <T>(arr: readonly T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Group an array of objects by a key.
 *
 * The key must be a top-level property whose value stringifies sensibly.
 * `undefined` and `null` group together under the string `"undefined"` /
 * `"null"`.
 */
export const groupBy = <T extends Record<string, unknown>>(
  arr: readonly T[],
  key: keyof T
): Record<string, T[]> => {
  return arr.reduce<Record<string, T[]>>((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Recursively flatten a nested array.
 */
export const flattenArray = <T>(arr: readonly unknown[]): T[] => {
  return arr.reduce<T[]>((flat, item) => {
    return flat.concat(
      Array.isArray(item) ? flattenArray<T>(item) : (item as T)
    );
  }, []);
};

/**
 * Return the elements of `a` that are not in `b` (set difference).
 */
export const getArrayDifference = <T>(
  a: readonly T[],
  b: readonly T[]
): T[] => {
  const exclude = new Set(b);
  return a.filter((item) => !exclude.has(item));
};

/**
 * Check whether a value is "empty".
 *
 * Handles the cases that would throw or mislead on a naive implementation:
 *   - `null` / `undefined` → true
 *   - `''` → true
 *   - `[]` → true
 *   - `{}` → true
 *   - `0`, `false` → false (they're values, not emptiness)
 */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Wait for a number of milliseconds.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Return a debounced version of a function.
 *
 * The returned function preserves `this` binding of the original — useful
 * when debouncing a method on a class instance.
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return function debounced(this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Return a throttled version of a function.
 *
 * Leading-edge only — calls during the throttle window are dropped, not
 * queued. If you need trailing-edge behavior, use a debounce variant.
 */
export const throttle = <T extends (...args: never[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return function throttled(this: unknown, ...args: Parameters<T>) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
};