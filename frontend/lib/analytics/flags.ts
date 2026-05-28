export function countryCodeToFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🏳️";
  const upper = code.toUpperCase();
  const A = 0x1f1e6;
  const codePoints = [
    A + upper.charCodeAt(0) - "A".charCodeAt(0),
    A + upper.charCodeAt(1) - "A".charCodeAt(0),
  ];
  return String.fromCodePoint(...codePoints);
}
