/**
 * WhatsApp Helper Utilities
 * Strictly uses the admin-configured WhatsApp number and sanitizes
 * it to a valid international wa.me format (e.g. prepending country code 91 for 10-digit Indian numbers).
 */

export function cleanWhatsAppNumber(number?: string | null): string {
  if (!number) return '';
  const digits = number.replace(/\D/g, '');
  if (!digits) return '';

  // 10-digit Indian phone number: prepend India country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // 11 digits starting with 0: replace leading 0 with 91
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppUrl(number?: string | null, message?: string): string {
  const clean = cleanWhatsAppNumber(number);
  if (!clean) return '#';
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
