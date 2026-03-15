import crypto from "crypto";

/**
 * Anonymizes an IP address using SHA-256 hashing.
 * This ensures GDPR compliance while still allowing for idempotent visitor tracking.
 */
export function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");
}
