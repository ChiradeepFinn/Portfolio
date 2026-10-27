'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * WebGL field — code-split, and never rendered on the server: the canvas does
 * nothing useful in HTML, and shipping the shader pipeline into the RSC payload
 * only delays the study title.
 */
const GradientASCII = dynamic(() => import('@/components/ui/GradientASCII'), { ssr: false });

const FONT = "ui-monospace, 'Cascadia Mono', 'SFMono-Regular', Consolas, monospace";
/** Density ramp; includes 0/1 so the field reads as a binary lattice up close. */
const CHARACTERS = ' 01·+xX8#@';

/**
 * The opening field is one shape on every study: a horizon cropped to the
 * top of the page, faded out before the title. Only the tint changes.
 */
const tints: Record<string, readonly [string, string, string, string]> = {
  sidequest: ['#5a454c', '#8a6a74', '#b09098', '#d0b4bc'],
  synesthesia: ['#4a5e78', '#6a84a0', '#8aa4bc', '#b0c8dc'],
  framework: ['#4a5e58', '#6a8478', '#8aa498', '#b0c4b8'],
  path: ['#4a5e74', '#6a829c', '#8aa4bc', '#b0c4d4'],
  stem: ['#5a4e42', '#7a6a58', '#9a8a74', '#b8a890'],
};

const fallbackTint: readonly [string, string, string, string] = ['#4a5e74', '#6a849c', '#8aa4bc', '#b0c8dc'];

function usePaperTheme() {
  const [paper, setPaper] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setPaper(root.dataset.theme === 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return paper;
}

export function CaseStudyAtmosphere({ slug }: { readonly slug: string }) {
  const paper = usePaperTheme();
  const colors = tints[slug] ?? fallbackTint;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_48%,transparent_100%)] sm:h-56"
    >
      {/*
        Bright sky sits in the upper field; rim ≈ vUv.y 0.33. -top-[16rem]
        keeps sky→rim in this crop (behind nav, fading before the title).
      */}
      <div className="absolute inset-x-0 -top-[16rem] h-[48rem]">
        <GradientASCII
          key={slug}
          colors={[...colors]}
          shape="horizon"
          characters={CHARACTERS}
          cellSize={11}
          density={0.72}
          glyphOpacity={paper ? 0.62 : 0.95}
          gradientOpacity={paper ? 0.28 : 0.72}
          glow={0.18}
          depthOfField={0}
          flicker={0.05}
          softness={0.65}
          scale={1.05}
          flow={0.12}
          speed={0.2}
          grain={0.03}
          variation={1}
          mouseInteraction
          scrambleRadius={0.06}
          clickEffect="none"
          lightMode={paper}
          fontFamily={FONT}
          // Crop shows the upper field (high `order`); the default intro
          // reveals low-order rim first, so the visible band stays blank ~2s.
          intro={false}
        />
      </div>
    </div>
  );
}
