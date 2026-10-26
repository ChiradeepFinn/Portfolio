'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import './GuestLogPrompt.css';

const STORAGE_KEY = 'guest-log-prompt';
const DELAY_MS = 2_000;

export function GuestLogPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'closed') return;
    } catch {
      return;
    }

    const id = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(id);
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
      <BrandMark
        alt="Chiradeep"
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
          click here to log yours😄
        </Link>
      </div>
    </aside>
  );
}
