import Link from 'next/link';
import {
  BookOpen,
  Camera,
  Circle,
  FileText,
  FlaskConical,
  FolderOpen,
  Gamepad2,
  Ghost,
  Github,
  House,
  Instagram,
  Link2,
  Linkedin,
  ListTodo,
  Mail,
  Music,
  Network,
  NotebookPen,
  Palette,
  PenLine,
  Route,
  ScrollText,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react';
import { footerBio, footerColumns, footerLegal, identity, type FooterLink } from '@/lib/site';
import { BrandMark } from './BrandMark';
import { Container } from './Container';
import { FrameBreak } from './FrameBreak';

/**
 * Explicit map rather than a namespace lookup: it keeps the icon set an
 * intentional list and lets the bundler drop everything else in lucide.
 */
const icons: Record<string, LucideIcon> = {
  House,
  User,
  FolderOpen,
  Music,
  PenLine,
  NotebookPen,
  Palette,
  Camera,
  BookOpen,
  FlaskConical,
  ListTodo,
  Route,
  ScrollText,
  Link2,
  Github,
  Linkedin,
  Instagram,
  Ghost,
  Gamepad2,
  Mail,
  Shield,
  FileText,
  Network,
};

function FooterIcon({ name }: { readonly name: string }) {
  const Icon = icons[name] ?? Circle;
  return <Icon size={13} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />;
}

function FooterAnchor({ link, className }: { readonly link: FooterLink; readonly className: string }) {
  const inner = (
    <>
      <FooterIcon name={link.icon} />
      {link.label}
    </>
  );

  if (!link.href) {
    return <span className={className}>{inner}</span>;
  }

  const external = link.href.startsWith('http');
  const mail = link.href.startsWith('mailto:');
  // The sitemap is an XML document. A client navigation would ask for a page payload.
  const document = link.href === '/sitemap.xml';

  if (external || mail || document) {
    return (
      <a
        href={link.href}
        className={className}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {inner}
    </Link>
  );
}

const itemClass =
  'flex items-center gap-1.5 text-[0.72rem] leading-5 whitespace-nowrap text-muted transition-colors duration-200 hover:text-foreground';

const legalClass =
  'flex items-center gap-2 text-[0.72rem] text-muted-2 transition-colors duration-200 hover:text-foreground';

export function Footer() {
  return (
    <footer className="relative bg-background">
      <Container className="grid gap-8 py-8 sm:py-10 md:grid-cols-[minmax(12rem,0.7fr)_1.45fr] md:items-start md:gap-10 lg:py-12">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-black">
              <BrandMark
                alt=""
                fill
                sizes="64px"
                loading="lazy"
                className="origin-center scale-[1.08] object-cover"
              />
            </span>
            <span className="font-display text-[1.25rem] leading-none text-foreground italic">
              {identity.firstName}
            </span>
          </div>
          <p className="mt-3 max-w-[16.5rem] text-[0.78rem] leading-5 text-muted">{footerBio}</p>
        </div>

        <div className="grid grid-cols-3 gap-x-3 sm:gap-x-6">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="min-w-0">
              <p className="eyebrow text-muted-2">{column.title}</p>
              <ul className="mt-3 grid gap-1.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} className={itemClass} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <div className="border-t border-hairline">
        <Container className="flex flex-col gap-3 py-4 text-[0.72rem] text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {identity.name}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLegal.map((link) => (
              <li key={link.label}>
                <FooterAnchor link={link} className={legalClass} />
              </li>
            ))}
          </ul>
        </Container>
      </div>
      {/* Closes the rails. The joint sits below the legal line, so the frame ends with the footer. */}
      <FrameBreak edge="flow" />
    </footer>
  );
}
