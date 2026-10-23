import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', end: true },
  { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'Budgets', icon: PiggyBank, path: '/budgets' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div className="sidebar-scrim" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-left">
            <div className="sidebar-logo">F</div>
            <span className="sidebar-title">FinSight</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Ledger tick rule — signature element separating brand from nav */}
        <div className="sidebar-ticks">
          {Array.from({ length: 34 }).map((_, i) => (
            <span
              key={i}
              className="sidebar-tick"
              style={{ height: i % 4 === 0 ? '100%' : '45%' }}
            />
          ))}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
            <NavLink
              key={label}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`
              }
            >
              <span className="sidebar-nav-item-label">
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / settings */}
        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-settings-btn${isActive ? ' sidebar-settings-btn--active' : ''}`
            }
          >
            <Settings size={18} strokeWidth={1.75} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  )
}

