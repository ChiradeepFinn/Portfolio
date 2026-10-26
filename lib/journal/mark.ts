export const JOURNAL_MARKS = [
  { value: 1, label: 'Soft' },
  { value: 2, label: 'Kind' },
  { value: 3, label: 'Lovely' },
  { value: 4, label: 'Radiant' },
  { value: 5, label: 'Exquisite' },
] as const;

export function journalMarkLabel(value: number): string | null {
  return JOURNAL_MARKS.find((mark) => mark.value === value)?.label ?? null;
}
