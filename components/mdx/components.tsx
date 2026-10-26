import type { AnchorHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';

function isSafeImageSrc(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//') && !src.includes('..');
}

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (value.startsWith('/') && !value.startsWith('//')) return !value.includes('..');
  if (value.startsWith('mailto:')) return !/[\r\n]/.test(value);
  return /^https?:\/\//i.test(value);
}

export function SafeLink({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!isSafeHref(href)) {
    return <span>{children}</span>;
  }
  const external = /^https?:\/\//i.test(href);
  return (
    <a {...props} href={href} rel={external ? 'noreferrer' : props.rel} target={external ? '_blank' : props.target}>
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function Callout({ title, children }: { readonly title?: string; readonly children: ReactNode }) {
  return (
    <aside className="max-w-2xl border-l border-border pl-5">
      {title ? <p className="text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">{title}</p> : null}
      <div className={title ? 'mt-2 text-[1.02rem] leading-[1.75] text-foreground' : 'text-[1.02rem] leading-[1.75] text-foreground'}>
        {children}
      </div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}) {
  return (
    <figure className="max-w-2xl">
      {isSafeImageSrc(src) ? (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          sizes="(min-width: 768px) 42rem, 100vw"
          className="h-auto w-full"
        />
      ) : (
        <p className="text-sm text-muted-2">{alt}</p>
      )}
      {caption ? <figcaption className="mt-3 text-sm leading-relaxed text-muted-2">{caption}</figcaption> : null}
    </figure>
  );
}

export function Citation({ id, children }: { readonly id?: string; readonly children: ReactNode }) {
  return (
    <span className="block max-w-2xl border-t border-border pt-3 text-sm leading-relaxed text-muted">
      {id ? <span className="meta mr-2">{id}</span> : null}
      {children}
    </span>
  );
}
