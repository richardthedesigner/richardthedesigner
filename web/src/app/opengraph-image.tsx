import {ImageResponse} from 'next/og'

// Default social-share card for every route that doesn't provide its own
// (home, /musings, /info, and any musing without imagery).
export const alt = 'Richard Murphy — Product Design & Platform Strategy'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#1A46F0',
          color: '#F7F6F2',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{display: 'flex', fontSize: 26, opacity: 0.9, letterSpacing: '0.06em'}}>
          richardthedesigner.com
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 96, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1}}>
            Richard Murphy
          </div>
          <div style={{fontSize: 38, marginTop: 26, opacity: 0.92}}>
            Product Design &amp; Platform Strategy
          </div>
        </div>
        <div style={{display: 'flex', fontSize: 24, opacity: 0.85}}>
          Platforms at scale · Design systems · AI-native product
        </div>
      </div>
    ),
    {...size},
  )
}
