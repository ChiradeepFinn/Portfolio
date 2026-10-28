import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

/** PNG favicon for Google Search (SVG alone is not a supported Google favicon format). */
export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default async function Icon() {
  const mark = await readFile(path.join(process.cwd(), 'public/brand/official-mark.png'));
  const src = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Official Chiradeep mark - abstract C */}
        <img src={src} width={40} height={40} alt="" />
      </div>
    ),
    size,
  );
}
