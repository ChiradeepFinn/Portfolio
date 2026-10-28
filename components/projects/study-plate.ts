import { cn } from '@/lib/utils';

/**
 * Shared study-card plate. Dark rim + inner light hairline, like the ref frame.
 */
export const studyPlateFrameClass =
  'rounded-[1.75rem] border-[3.09px] border-white/15 bg-black/35 p-[3.64px] shadow-[0_24px_60px_rgba(0,0,0,0.28)]';

export const studyPlateInnerClass =
  'relative flex h-full flex-col justify-center overflow-hidden rounded-[1.45rem] bg-[length:280%_280%] bg-[position:0%_0%] p-5 sm:p-7';

export function studyPlateInnerLinkedClass(linked: boolean): string {
  return cn(
    studyPlateInnerClass,
    linked &&
      'transition-[background-position,box-shadow,filter] duration-700 ease-cinematic group-hover:bg-[position:100%_100%] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] group-hover:brightness-110',
  );
}
