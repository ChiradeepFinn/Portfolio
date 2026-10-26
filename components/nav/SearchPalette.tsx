'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Camera,
  Circle,
  FileText,
  FlaskConical,
  Folder,
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
  Moon,
  Music,
  Network,
  Palette,
  PenLine,
  Phone,
  Route,
  Search,
  Shield,
  Sun,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { SearchItem } from '@/lib/search';
import { footerColumns, footerLegal, type FooterLink } from '@/lib/site';
import { cn } from '@/lib/utils';

interface SearchPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly index: readonly SearchItem[];
}

interface MenuRow {
  readonly key: string;
  readonly section: string;
  readonly label: string;
  readonly href: string | null;
  readonly icon: string;
  readonly layout: 'grid' | 'inline';
  readonly note?: string;
}

const icons: Record<string, LucideIcon> = {
  House,
  User,
  FolderOpen,
  Folder,
  Music,
  PenLine,
  Palette,
  Camera,
  BookOpen,
  FlaskConical,
  ListTodo,
  Route,
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

const footerMenu: readonly MenuRow[] = [
  ...footerColumns.flatMap((column) =>
    column.links.map((link) => ({
      key: `${column.title}-${link.label}`,
      section: column.title,
      label: link.label,
      href: link.href,
      icon: link.icon,
      layout: column.title === "Let's meet here" ? ('inline' as const) : ('grid' as const),
    })),
  ),
  ...footerLegal.map((link: FooterLink) => ({
    key: `Legal-${link.label}`,
    section: 'Legal',
    label: link.label,
    href: link.href,
    icon: link.icon,
    layout: 'inline' as const,
  })),
];

const actionButtonClass =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-chrome text-muted shadow-[var(--nav-shadow)] transition-colors duration-200 hover:bg-chrome-active hover:text-foreground';

type ThemeName = 'dark' | 'light';

function applyTheme(next: ThemeName) {
  const root = document.documentElement;
  if (next === 'light') root.dataset.theme = 'light';
  else delete root.dataset.theme;
  localStorage.setItem('theme', next);
}

function useTheme() {
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [curtain, setCurtain] = useState<ThemeName | null>(null);
  const busy = useRef(false);
  const pending = useRef<ThemeName>('dark');
  const run = useRef(0);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    return () => document.documentElement.classList.remove('theme-settling');
  }, []);

  const toggle = useCallback(() => {
    if (busy.current) return;
    const next: ThemeName = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next);
      setTheme(next);
      return;
    }
    busy.current = true;
    pending.current = next;
    document.documentElement.classList.add('theme-settling');
    setCurtain(next);
  }, []);

  useEffect(() => {
    if (!curtain) return;
    const node = document.querySelector<HTMLElement>('.theme-curtain');
    if (!node) {
      applyTheme(pending.current);
      setTheme(pending.current);
      document.documentElement.classList.remove('theme-settling');
      busy.current = false;
      setCurtain(null);
      return;
    }

    const id = ++run.current;
    const duration = 1600;
    const dropEnd = 0.64;
    const fadeStart = 0.72;
    const steps = 72;
    const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
    const frames: Keyframe[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let shift = -25;
      let opacity = 1;
      if (t <= dropEnd) {
        shift = -100 + 75 * ease(t / dropEnd);
      } else if (t >= fadeStart) {
        opacity = 1 - ease((t - fadeStart) / (1 - fadeStart));
      }
      frames.push({
        transform: `translate3d(0, ${shift.toFixed(3)}%, 0)`,
        opacity: Number(opacity.toFixed(4)),
        offset: t,
      });
    }

    const anim = node.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
    let swapped = false;
    let settled = false;
    let frame = 0;

    const finish = () => {
      if (settled || run.current !== id) return;
      settled = true;
      if (!swapped) applyTheme(pending.current);
      document.documentElement.classList.remove('theme-settling');
      setTheme(pending.current);
      busy.current = false;
      setCurtain(null);
    };

    const watch = () => {
      if (run.current !== id || anim.playState === 'idle') return;
      const elapsed = anim.currentTime;
      if (!swapped && typeof elapsed === 'number' && elapsed >= duration * dropEnd) {
        swapped = true;
        applyTheme(pending.current);
      }
      if (anim.playState === 'finished') {
        finish();
        return;
      }
      frame = requestAnimationFrame(watch);
    };

    frame = requestAnimationFrame(watch);
    const backup = window.setTimeout(finish, duration + 480);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(backup);
      if (!settled) anim.cancel();
    };
  }, [curtain]);

  return { theme, toggle, curtain };
}

function IconMark({ name, size = 15 }: { readonly name: string; readonly size?: number }) {
  const Icon = icons[name] ?? Circle;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

/** Short prompts that match a project field. Not the tray's own labels. */
const prompts = [
  'a quest',
  'synesthesia',
  'composition',
  'vocals',
  'what now',
  'generative',
  'computer vision',
  'web audio',
  'a graph',
  'final-final',
  'atmosphere',
  'instrumentals',
  'personalization',
  'five hundred frames',
  'mixes',
  'prerequisite',
] as const;

/** Swaps the whole hint. No typing. */
function useRotatingPrompt(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % prompts.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active]);

  return prompts[index];
}

/**
 * Bottom search sheet. One panel: the field, then the footer's sections as an
 * index. The list scrolls on its own so the page behind it stays still.
 */
export function SearchPalette({ isOpen, onClose, index }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const keyboardMove = useRef(false);
  const glideRef = useRef<(top: number) => void>(() => {});
  const { theme, toggle: toggleTheme, curtain } = useTheme();
  const router = useRouter();
  const reduce = useReducedMotion();
  const prompt = useRotatingPrompt(isOpen && query.length === 0 && reduce === false);

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const menu = trimmed
      ? footerMenu.filter((row) => row.label.toLowerCase().includes(trimmed) || row.section.toLowerCase().includes(trimmed))
      : footerMenu;

    if (!trimmed) return menu;

    const projects: MenuRow[] = index
      .filter((item) => item.group === 'Projects' && item.keywords.includes(trimmed))
      .map((item) => ({
        key: `project-${item.href}`,
        section: 'Projects',
        label: item.label,
        href: item.href,
        icon: 'Folder',
        layout: 'grid' as const,
        note: item.description,
      }));

    const insertAt = menu.findIndex((row) => row.layout === 'inline');
    if (insertAt === -1) return [...menu, ...projects];
    return [...menu.slice(0, insertAt), ...projects, ...menu.slice(insertAt)];
  }, [index, query]);

  const actionable = useMemo(() => rows.filter((row) => row.href), [rows]);

  const sections = useMemo(() => {
    const map = new Map<string, { layout: MenuRow['layout']; rows: MenuRow[] }>();
    for (const row of rows) {
      const bucket = map.get(row.section);
      if (bucket) bucket.rows.push(row);
      else map.set(row.section, { layout: row.layout, rows: [row] });
    }
    return Array.from(map.entries());
  }, [rows]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const shell = shellRef.current;
    const viewport = window.visualViewport;
    if (!shell || !viewport) return;

    const placeAboveKeyboard = () => {
      const covered = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      shell.style.bottom = covered > 0 ? `${covered}px` : '';
    };

    placeAboveKeyboard();
    viewport.addEventListener('resize', placeAboveKeyboard);
    viewport.addEventListener('scroll', placeAboveKeyboard);
    return () => {
      viewport.removeEventListener('resize', placeAboveKeyboard);
      viewport.removeEventListener('scroll', placeAboveKeyboard);
      shell.style.bottom = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (!list) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let current = list.scrollTop;
    let target = list.scrollTop;
    let last = 0;
    let writing = false;

    const limit = () => Math.max(0, list.scrollHeight - list.clientHeight);

    const tick = (now: number) => {
      const dt = Math.min(32, last ? now - last : 16) / 1000;
      last = now;
      const max = limit();
      target = Math.min(max, Math.max(0, target));

      // Continuous follow. A new wheel tick only moves the destination,
      // so the motion keeps its speed instead of restarting.
      const follow = 1 - Math.exp(-dt / 0.085);
      current += (target - current) * follow;

      const settled = Math.abs(target - current) < 0.4;
      if (settled) current = target;

      writing = true;
      list.scrollTop = current;
      writing = false;

      if (settled) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const glideTo = (next: number) => {
      target = Math.min(limit(), Math.max(0, next));
      if (reduceMotion || Math.abs(target - current) < 0.5) {
        current = target;
        list.scrollTop = target;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        return;
      }
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    glideRef.current = glideTo;

    const onWheel = (event: WheelEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list.clientHeight : 1;
      glideTo(target + event.deltaY * unit);
    };

    const onScroll = () => {
      // Programmatic updates dispatch scroll too. Only a drag or a touch
      // leaves the element somewhere other than the position we just wrote.
      if (writing || Math.abs(list.scrollTop - current) < 1) return;
      current = list.scrollTop;
      target = current;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };

    list.addEventListener('wheel', onWheel, { passive: false });
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      list.removeEventListener('wheel', onWheel);
      list.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      glideRef.current = () => {};
    };
  }, [isOpen]);

  useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[data-active="true"]');
    if (!list || !active) return;

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.top < listRect.top) {
      glideRef.current(list.scrollTop - (listRect.top - activeRect.top));
    } else if (activeRect.bottom > listRect.bottom) {
      glideRef.current(list.scrollTop + (activeRect.bottom - listRect.bottom));
    }
  }, [activeIndex, sections]);

  const go = useCallback(
    (href: string) => {
      onClose();
      if (href.startsWith('http') || href.startsWith('mailto:') || href === '/sitemap.xml') {
        window.location.assign(href);
        return;
      }
      router.push(href);
    },
    [onClose, router],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        keyboardMove.current = true;
        setActiveIndex((current) => Math.min(current + 1, Math.max(actionable.length - 1, 0)));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        keyboardMove.current = true;
        setActiveIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const item = actionable[activeIndex];
        if (item?.href) go(item.href);
      } else if (event.key === 'Escape') {
        onClose();
      }
    },
    [actionable, activeIndex, go, onClose],
  );

  return (
    <>
      {curtain && typeof document !== 'undefined'
        ? createPortal(
            <div
              aria-hidden="true"
              className={cn('theme-curtain', curtain === 'light' && 'theme-curtain-light')}
            />,
            document.body,
          )
        : null}
    <AnimatePresence>
      {isOpen && (
        <div
          ref={shellRef}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center ps-[max(0.75rem,env(safe-area-inset-left))] pe-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:ps-4 sm:pe-4"
        >
          <motion.div
            role="dialog"
            aria-label="Search"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="@container pointer-events-auto flex w-full min-w-0 max-w-[min(100%,36rem)] flex-col gap-2 sm:max-w-[40rem] lg:max-w-[42rem]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-chrome px-4 shadow-[var(--nav-shadow)]">
                <Search size={15} className="shrink-0 text-muted" aria-hidden="true" />
                <div className="relative min-w-0 flex-1">
                  {query.length === 0 && reduce === false ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={prompt}
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -2 }}
                          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                          className="truncate text-[0.8125rem] text-muted-2 sm:text-sm"
                        >
                          Try {prompt}…
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ) : null}
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={reduce === false ? '' : 'Try composition, vocals, synesthesia…'}
                    aria-label="Search the site"
                    className="relative w-full min-w-0 bg-transparent text-[0.8125rem] text-foreground placeholder:text-muted-2 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => go('/contact')}
                  aria-label="Contact"
                  className={actionButtonClass}
                >
                  <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  aria-pressed={theme === 'light'}
                  className={actionButtonClass}
                >
                  {theme === 'dark' ? (
                    <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className={actionButtonClass}
                >
                  <X size={15} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              ref={listRef}
              data-lenis-prevent
              className="glass-surface max-h-[min(18rem,calc(100svh-10rem))] overflow-y-auto overscroll-contain rounded-card bg-chrome px-2.5 pt-1.5 pb-3 shadow-[var(--elev-shadow-lg)] [scrollbar-color:var(--scrollbar)_transparent] [scrollbar-width:thin] sm:max-h-[min(22rem,calc(100svh-9rem))] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/25 [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {sections.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-muted">
                  Nothing matches &ldquo;{query}&rdquo;
                </p>
              ) : (
                sections.map(([section, group], sectionIndex) => (
                  <section
                    key={section}
                    className={sectionIndex > 0 ? 'mt-1 border-t border-hairline pt-1' : undefined}
                  >
                    <p className="px-2 pt-2 pb-1 text-[0.65rem] tracking-[0.14em] text-muted-2 uppercase">
                      {section}
                    </p>

                    {group.layout === 'inline' ? (
                      <div className="flex flex-wrap gap-x-3.5 gap-y-1 px-2 pt-0.5 pb-2">
                        {group.rows.map((row) => {
                          const position = actionable.indexOf(row);
                          const active = position === activeIndex;
                          const external = Boolean(row.href?.startsWith('http'));
                          const className = cn(
                            'inline-flex items-center gap-1.5 text-[0.82rem] leading-6 transition-colors duration-200',
                            !row.href && 'cursor-default text-muted-2',
                            row.href && (active ? 'text-foreground' : 'text-muted hover:text-foreground'),
                          );
                          const inner = (
                            <>
                              <IconMark name={row.icon} size={13} />
                              {row.label}
                            </>
                          );

                          if (!row.href) {
                            return (
                              <span key={row.key} className={className}>
                                {inner}
                              </span>
                            );
                          }

                          return (
                            <a
                              key={row.key}
                              href={row.href}
                              data-active={active ? 'true' : 'false'}
                              target={external ? '_blank' : undefined}
                              rel={external ? 'noreferrer' : undefined}
                              onMouseEnter={() => setActiveIndex(position)}
                              onClick={(event) => {
                                if (!external && !row.href?.startsWith('mailto:')) {
                                  event.preventDefault();
                                  go(row.href as string);
                                } else {
                                  onClose();
                                }
                              }}
                              className={className}
                            >
                              {inner}
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-x-1 @min-[20rem]:grid-cols-2">
                        {group.rows.map((row) => {
                          const position = actionable.indexOf(row);
                          const active = position >= 0 && position === activeIndex;
                          const className = cn(
                            'flex h-8 min-w-0 items-center gap-2.5 rounded-full px-2.5 text-left transition-colors duration-200',
                            !row.href && 'cursor-default text-muted-2',
                            row.href && (active ? 'bg-wash-strong text-foreground' : 'text-foreground hover:bg-wash'),
                          );
                          const inner = (
                            <>
                              <span
                                className={cn(
                                  'flex w-4 shrink-0 justify-center',
                                  active ? 'text-foreground' : 'text-muted',
                                )}
                              >
                                <IconMark name={row.icon} size={14} />
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[0.84rem]">
                                {row.label}
                                {row.note ? <span className="ml-2 text-[0.72rem] text-muted-2">{row.note}</span> : null}
                              </span>
                            </>
                          );

                          if (!row.href) {
                            return (
                              <span key={row.key} className={className}>
                                {inner}
                              </span>
                            );
                          }

                          return (
                            <button
                              key={row.key}
                              type="button"
                              data-active={active ? 'true' : 'false'}
                              onMouseEnter={() => setActiveIndex(position)}
                              onClick={() => go(row.href as string)}
                              className={className}
                            >
                              {inner}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
