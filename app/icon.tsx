import { ImageResponse } from 'next/og';

/** PNG favicon for Google Search (SVG alone is not in Google's supported favicon formats). */
export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          color: '#f4f4f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.04em',
        }}
      >
        C 
      </div>
    ),
    size,
  );
}
