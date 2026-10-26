import { ImageResponse } from 'next/og';

export const alt = 'Chiradeep, creative technologist';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          color: '#f4f4f4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: '0.22em', color: '#8d8d97' }}>PORTFOLIO</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: '-0.04em' }}>Chiradeep</div>
          <div style={{ marginTop: 22, fontSize: 32, color: '#c8c8d0' }}>Creative technologist</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#8d8d97' }}>
          <span>Karur, Tamil Nadu</span>
          <span>CF°</span>
        </div>
      </div>
    ),
    size,
  );
}
