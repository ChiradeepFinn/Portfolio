import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 72,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.04em',
        }}
      >
        CF
      </div>
    ),
    size,
  );
}
