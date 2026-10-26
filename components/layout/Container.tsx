import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ShellWidth = 'default' | 'wide' | 'narrow';

interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly width?: ShellWidth;
  readonly as?: ElementType;
}

const widthClass: Record<ShellWidth, string> = {
  default: 'shell',
  wide: 'shell-wide',
  narrow: 'shell-narrow',
};

export function Container({ children, className, width = 'default', as }: ContainerProps) {
  const Tag: ElementType = as ?? 'div';
  return <Tag className={cn(widthClass[width], className)}>{children}</Tag>;
}
