/** Values used as blanks in the seed. They should not render as metadata. */
export function isBlank(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed.length === 0 || trimmed === '-' || trimmed === '\u2014' || trimmed === '-:-' || trimmed === '\u2014:\u2014';
}
