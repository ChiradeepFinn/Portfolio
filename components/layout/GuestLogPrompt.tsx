'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { media } from '@/lib/media';
import './GuestLogPrompt.css';

const STORAGE_KEY = 'guest-log-prompt';
/** Wait until the main paint path is clear so this card does not steal LCP. */
const DELAY_MS = 6_000;

export function GuestLogPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'closed') return;
    } catch {
      return;
    }

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let cancelled = false;

    const show = () => {
      if (!cancelled) setVisible(true);
    };

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') {
          idleId = window.requestIdleCallback(show, { timeout: 1500 });
        } else {
          show();
        }
      }, DELAY_MS);
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!visible || pathname === '/journal') return null;

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'closed');
    } catch {
      /* Private browsing can block storage. The note still closes for this view. */
    }
  };

  return (
    <aside className="guest-log" role="status" aria-label="Guest journal">
      <Image
        src={media.brand.logo}
        alt="Chiradeep Finn"
        width={136}
        height={136}
        sizes="136px"
        className="guest-log__photo"
      />
      <div className="guest-log__card">
        <button type="button" className="guest-log__close" onClick={close} aria-label="Close">
          <X size={14} strokeWidth={2} aria-hidden />
        </button>
        <p className="guest-log__copy">Leave a short compliment in the guest journal.</p>
        <Link href="/journal" className="guest-log__link" onClick={close}>
          Open the guest journal
        </Link>
      </div>
    </aside>
  );
}
