'use client';

import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { JournalSignIn } from './JournalSignIn';

export function JournalTray({
  open,
  onClose,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close the sign-in window"
            className="fixed inset-0 z-40 bg-black/55"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            id="journal-login-tray"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, x: '-50%', y: '-46%', scale: 0.96 }}
            animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: '-50%', y: '-46%', scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 z-50 w-[min(22.5rem,calc(100%-2rem))] rounded-[1.75rem] border border-border bg-surface p-6 outline-none sm:p-8"
          >
            <JournalSignIn titleId={titleId} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
