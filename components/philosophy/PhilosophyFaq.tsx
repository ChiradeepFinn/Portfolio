'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { philosophyFaq } from '@/lib/data/worlds';
import { cn } from '@/lib/utils';

/**
 * Expandable FAQ with keyboard-friendly buttons (not only native details),
 * so open state and motion stay consistent across browsers.
 */
export function PhilosophyFaq() {
  const baseId = useId();
  const reduce = useReducedMotion() === true;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="border-b border-border">
      {philosophyFaq.map((item, index) => {
        const id = `${baseId}-${index}`;
        const panelId = `${id}-panel`;
        const open = openId === id;

        return (
          <div key={item.question} className="border-t border-border">
            <h3>
              <button
                type="button"
                id={id}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : id)}
                className={cn(
                  'group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left text-[1.02rem] text-foreground',
                  'transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue',
                )}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-mono text-sm text-muted-2 transition-transform duration-300 ease-cinematic motion-safe:group-hover:translate-y-px"
                >
                  {open ? '-' : '+'}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={id}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-5 text-[1.02rem] leading-[1.75] text-muted">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
