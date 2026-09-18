import bcrypt from 'bcryptjs'

/**
 * Work factor. 12 is the current sweet spot: roughly 250 ms per hash on
 * modern server hardware, which is slow enough to make offline brute-force
 * of a leaked DB painful and fast enough that a login endpoint doesn't
 * become a DoS vector under load.
 *
 * Do not lower this without a compensating measure (rate limiting on login
 * is not enough on its own — a leaked hash dump doesn't go through your
 * rate limiter).
 */
const SALT_ROUNDS = 12

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}