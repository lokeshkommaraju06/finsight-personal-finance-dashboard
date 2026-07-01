import { Menu, Search, Bell } from 'lucide-react'

export default function Navbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-paper/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          className="text-ink/70 hover:text-ink lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-display text-xl leading-tight text-ink">{title}</h1>
          {subtitle && (
            <p className="text-sm text-ink-soft">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative hidden sm:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-56 rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-emerald/30"
          />
        </label>

        <button
          className="relative rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rust" />
        </button>

        <div className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-soft font-display text-sm text-emerald">
            A
          </div>
          <span className="hidden text-sm font-medium text-ink sm:block">
            Aditi
          </span>
        </div>
      </div>
    </header>
  )
}
