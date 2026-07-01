import { Menu, Search, Bell } from 'lucide-react'

export default function Navbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="navbar-title">{title}</h1>
          {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">
        <label className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="navbar-search-input"
          />
        </label>

        <button className="navbar-icon-btn" aria-label="Notifications">
          <Bell size={19} strokeWidth={1.75} />
          <span className="navbar-icon-dot" />
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">A</div>
          <span className="navbar-profile-name">Aditi</span>
        </div>
      </div>
    </header>
  )
}
