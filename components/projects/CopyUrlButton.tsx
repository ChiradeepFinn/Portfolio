'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, ChevronDown, Copy, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CopiedKind = 'url' | 'markdown' | null;

/**
 * Case-study share control: a blue trigger that opens a compact tray for
 * copying the page, its Markdown twin, viewing that twin, or handing the
 * URL to ChatGPT / Claude.
 */
export function CopyUrlButton() {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CopiedKind>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const markCopied = (kind: CopiedKind) => {
    setCopied(kind);
    setOpen(false);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    markCopied('url');
  };

  const copyMarkdown = async () => {
    setBusy(true);
    try {
      const response = await fetch(markdownPath(), {
        headers: { Accept: 'text/markdown' },
      });
      if (!response.ok) throw new Error(`Markdown twin failed: ${response.status}`);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      markCopied('markdown');
    } catch {
      // Leave the tray open so the action can be retried.
    } finally {
      setBusy(false);
    }
  };

  const viewMarkdown = () => {
    setOpen(false);
    window.location.assign(markdownPath());
  };

  const openIn = (provider: 'chatgpt' | 'claude') => {
    const page = window.location.href;
    const prompt = `Read and summarize this page: ${page}`;
    const href =
      provider === 'chatgpt'
        ? `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
        : `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    setOpen(false);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const triggerLabel = copied === 'url' || copied === 'markdown' ? 'Copied' : 'Copy URL';

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 text-sm text-accent-blue"
      >
        {copied ? (
          <Check size={15} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Link2 size={15} strokeWidth={1.75} aria-hidden="true" />
        )}
        {triggerLabel}
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Share this study"
          className="absolute top-[calc(100%+10px)] right-0 z-40 w-[15.5rem] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-[var(--elev-shadow-lg)]"
        >
          <MenuRow
            icon={<Link2 size={16} strokeWidth={1.75} aria-hidden="true" />}
            label="Copy URL"
            onSelect={() => void copyUrl()}
          />
          <MenuRow
            icon={<Copy size={16} strokeWidth={1.75} aria-hidden="true" />}
            label={busy ? 'Copying…' : 'Copy as Markdown'}
            disabled={busy}
            onSelect={() => void copyMarkdown()}
          />
          <MenuRow
            icon={<MarkdownIcon />}
            label="View as Markdown"
            onSelect={viewMarkdown}
          />
          <MenuRow
            icon={<ChatGptIcon />}
            label="Open in ChatGPT"
            external
            onSelect={() => openIn('chatgpt')}
          />
          <MenuRow
            icon={<ClaudeIcon />}
            label="Open in Claude"
            external
            onSelect={() => openIn('claude')}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuRow({
  icon,
  label,
  onSelect,
  external = false,
  disabled = false,
}: {
  readonly icon: ReactNode;
  readonly label: string;
  readonly onSelect: () => void;
  readonly external?: boolean;
  readonly disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[0.9rem] text-popover-foreground transition-colors duration-150 hover:bg-foreground/10 disabled:opacity-50"
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-muted">{icon}</span>
      <span className="min-w-0 flex-1 tracking-[-0.01em]">{label}</span>
      {external ? (
        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-muted-2" />
      ) : null}
    </button>
  );
}

function markdownPath() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '/' ? '/index.md' : `${path}.md`;
}

function MarkdownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.5 14.5V9.5L8.5 12L10.5 9.5V14.5M13.5 14.5V9.5H15.5C16.6 9.5 17.5 10.4 17.5 11.5C17.5 12.6 16.6 13.5 15.5 13.5H13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatGptIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M21.5 9.6a5.1 5.1 0 0 0-.44-3.83 5.2 5.2 0 0 0-5.6-2.5A5.2 5.2 0 0 0 12 1.5a5.2 5.2 0 0 0-4.9 3.57 5.2 5.2 0 0 0-3.46.9 5.2 5.2 0 0 0-1.92 4.73A5.1 5.1 0 0 0 2.5 14.4a5.1 5.1 0 0 0 .44 3.83 5.2 5.2 0 0 0 5.6 2.5A5.2 5.2 0 0 0 12 22.5a5.2 5.2 0 0 0 4.9-3.57 5.2 5.2 0 0 0 3.46-.9 5.2 5.2 0 0 0 1.92-4.73A5.1 5.1 0 0 0 21.5 9.6Zm-9.85 9.9c-.9 0-1.77-.32-2.46-.9l.12-.07 4.07-2.35a.67.67 0 0 0 .34-.58v-5.73l1.72 1v4.78a3.55 3.55 0 0 1-3.79 3.85Zm-8.14-3.48c-.45-.78-.54-1.7-.26-2.55l.12.07 4.07 2.35c.21.12.47.12.68 0l4.97-2.87v1.99l-4.2 2.43a3.55 3.55 0 0 1-5.38-1.42Zm-1.06-8.8c.45-.78 1.16-1.35 2-1.6v4.84c0 .24.13.46.34.58l4.96 2.86-1.72 1-4.2-2.43a3.55 3.55 0 0 1-1.38-4.25Zm14.2 3.3-4.97-2.87 1.72-1 4.2 2.43a3.55 3.55 0 0 1-1.38 6.4v-4.84c0-.24-.13-.46-.34-.58a.1.1 0 0 0-.03-.02Zm1.7-2.56-.12-.07-4.07-2.35a.67.67 0 0 0-.68 0L9.5 9.33V7.34l4.2-2.43a3.55 3.55 0 0 1 5.39 1.42c.45.78.54 1.7.26 2.55Zm-10.7 3.54-1.72-1V7.07a3.55 3.55 0 0 1 5.8-2.73l-.12.07-4.07 2.35a.67.67 0 0 0-.34.58l-.01 5.58Zm.92-1.98 2.21-1.28 2.21 1.28v2.55l-2.21 1.28-2.21-1.28V12.52Z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12.9 3.1 16.4 13l1.9-5.7c.2-.6.9-1 1.5-.8.6.2 1 .9.8 1.5l-3.1 9.4c-.2.7-.9 1.1-1.6.9-.5-.2-.9-.6-.9-1.1l-1.8-5.4-1.9 5.4c-.2.6-.8 1-1.5.9-.6-.2-1-.8-.9-1.5l3.1-9.3c.2-.7.9-1.1 1.6-.9.3.1.5.3.7.5l.6-1.8c.2-.6.9-1 1.5-.8.6.2 1 .9.8 1.5l-.4 1.3ZM6.2 8.2c.6-.2 1.3.1 1.5.7l2.3 6.8c.2.6-.1 1.3-.7 1.5-.6.2-1.3-.1-1.5-.7L5.5 9.7c-.2-.6.1-1.3.7-1.5Z" />
    </svg>
  );
}
