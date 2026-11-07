import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_BYTES = 16;
const HASH_BYTES = 64;

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const hash = scryptSync(password, salt, HASH_BYTES);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, encodedHash: string): boolean {
  const [algorithm, saltHex, hashHex, extra] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !hashHex || extra !== undefined) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  if (salt.length !== SALT_BYTES || expected.length !== HASH_BYTES) return false;

  const actual = scryptSync(password, salt, HASH_BYTES);
  return timingSafeEqual(actual, expected);
}
