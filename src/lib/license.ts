import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateSegment = customAlphabet(alphabet, 4);

export function generateLicenseKey(): string {
  return `OMNI-${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

export function validateLicenseKeyFormat(key: string): boolean {
  return /^OMNI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key);
}
