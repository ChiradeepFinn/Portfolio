import type { MDXComponents } from 'mdx/types';
import { Callout, Citation, Figure, SafeLink } from '@/components/mdx/components';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: SafeLink,
    Callout,
    Figure,
    Citation,
    ...components,
  };
}
