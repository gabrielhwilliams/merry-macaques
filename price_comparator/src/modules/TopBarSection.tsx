import type { ReactNode } from 'react'

type TopBarSectionProps = {
  children: ReactNode
  onShare: () => Promise<void> | void
}

export default function TopBarSection({ children, onShare }: TopBarSectionProps) {
  return (
    <div className="Top">
      <div className="LocationContainer">{children}</div>

      <div className="Share">
        <button onClick={onShare}>Share</button>
        <div style={{ width: '40px' }} />
        <img
          src="/trimmed-logo.png"
          alt="CartSmart"
          loading="lazy"
          height="80"
          width="137"
        />
      </div>
    </div>
  )
}
