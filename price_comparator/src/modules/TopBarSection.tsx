import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

type TopBarSectionProps = {
  children: ReactNode
  onShare: () => Promise<void> | void
  onToggleTheme: () => void
  themeMode: ThemeMode
}

export default function TopBarSection({
  children,
  onShare,
  onToggleTheme,
  themeMode
}: TopBarSectionProps) {
  return (
    <div className="Top">
      <div className="LocationContainer">{children}</div>

      <div className="Share">
        <div className="ShareActions">
          <button className="topbar-btn topbar-btn--secondary" onClick={onToggleTheme}>
            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="topbar-btn" onClick={onShare}>
            Share
          </button>
        </div>

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
