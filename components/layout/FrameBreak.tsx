/**
 * The joint used across the portfolio. Hatch in the page margins, the column
 * knocked back to the page color, and a square where each rule meets a rail.
 */
export function FrameBreak({ edge = 'start' }: { readonly edge?: 'start' | 'end' | 'rule' | 'flow' }) {
  const place =
    edge === 'end'
      ? 'band-break-end'
      : edge === 'rule'
        ? 'band-break-rule'
        : edge === 'flow'
          ? 'band-break-flow'
          : 'band-break-start';

  return (
    <div aria-hidden="true" className={`band-break ${place}`}>
      <span className="band-mark band-mark-tl" />
      <span className="band-mark band-mark-tr" />
      <span className="band-mark band-mark-bl" />
      <span className="band-mark band-mark-br" />
    </div>
  );
}
