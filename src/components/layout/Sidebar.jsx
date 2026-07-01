import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Transactions', icon: ArrowLeftRight, soon: true },
  { label: 'Budgets', icon: PiggyBank, soon: true },
  { label: 'Reports', icon: BarChart3, soon: true },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-paper
          transition-transform duration-200 ease-out
          lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald text-paper font-display text-sm">
              L
            </div>
            <span className="font-display text-lg tracking-tight">Ledger</span>
          </div>
          <button
            className="text-paper/60 hover:text-paper lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Ledger tick rule — signature element separating brand from nav */}
        <div className="mx-6 mb-2 flex h-3 items-end gap-[3px]">
          {Array.from({ length: 34 }).map((_, i) => (
            <span
              key={i}
              className="block w-px bg-paper/15"
              style={{ height: i % 4 === 0 ? '100%' : '45%' }}
            />
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {NAV_ITEMS.map(({ label, icon: Icon, active, soon }) => (
            <button
              key={label}
              disabled={soon}
              className={`
                flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors
                ${active
                  ? 'bg-paper/10 text-paper font-medium'
                  : soon
                  ? 'text-paper/35 cursor-not-allowed'
                  : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}
              `}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </span>
              {soon && (
                <span className="rounded-full border border-paper/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-paper/40">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / settings */}
        <div className="border-t border-paper/10 px-4 py-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-paper/70 hover:bg-paper/5 hover:text-paper transition-colors">
            <Settings size={18} strokeWidth={1.75} />
            Settings
          </button>
        </div>
      </aside>
    </>
  )
}
