import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root (works from any CWD)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Decode a Base64-encoded password from environment variables.
 * Falls back to raw value if not encoded (dev convenience).
 */
export function decodePassword(encoded: string | undefined): string {
  if (!encoded) return '';
  // Check if it looks like Base64 (alphanumeric + / + = padding)
  if (/^[A-Za-z0-9+/]+=*$/.test(encoded) && encoded.length > 4) {
    try {
      return Buffer.from(encoded, 'base64').toString('utf-8');
    } catch {
      return encoded; // fallback: treat as raw
    }
  }
  return encoded; // not encoded, return as-is
}

/** Typed accessor for all SauceDemo user credentials */
export const env = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',

  standardUser: {
    username: process.env.SAUCE_STANDARD_USER || '',
    password: decodePassword(process.env.SAUCE_STANDARD_PASS),
  },
  lockedOutUser: {
    username: process.env.SAUCE_LOCKED_OUT_USER || '',
    password: decodePassword(process.env.SAUCE_LOCKED_OUT_PASS),
  },
  invalidUser: {
    username: process.env.SAUCE_INVALID_USER || '',
    password: decodePassword(process.env.SAUCE_INVALID_PASS),
  },
} as const;

// ── Validate credentials are available ──
const missing = [
  'SAUCE_STANDARD_USER', 'SAUCE_STANDARD_PASS',
  'SAUCE_LOCKED_OUT_USER', 'SAUCE_LOCKED_OUT_PASS',
  'SAUCE_INVALID_USER', 'SAUCE_INVALID_PASS',
].filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}\n` +
    `Set them in .env (see .env.example) or as GitHub Actions secrets.`,
  );
}
