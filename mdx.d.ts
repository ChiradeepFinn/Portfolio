declare module '*.mdx' {
  export const frontmatter: {
    readonly title: string;
    readonly slug: string;
    readonly summary: string;
    readonly publishedAt: string;
    readonly status: 'draft' | 'in-progress' | 'published';
    readonly tags?: readonly string[];
    readonly coverImage?: string;
  };
}
