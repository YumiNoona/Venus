import { createHash } from "crypto";

/**
 * Hashes an IP address using SHA-256 for privacy compliance (GDPR).
 */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}
