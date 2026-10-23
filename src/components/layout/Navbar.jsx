import { useState, useRef, useEffect } from 'react'
import { Menu, Search, Bell, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useBudgets } from '../../context/BudgetsContext.jsx'
import { formatCurrency } from '../../utils/format.js'

export default function Navbar({ title, subtitle, onMenuClick }) {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { budgetSummary } = useBudgets()

  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const userName = settings?.userName || 'Aditi'
  const userInitial = userName.charAt(0).toUpperCase() || 'A'
  const alertThreshold = settings?.budgetAlertThreshold || 90

  // Filter budgets that have exceeded or reached warning threshold
  const alerts = budgetSummary.filter(
    (b) => b.exceeded || b.percentSpent >= alertThreshold
  )

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/transactions?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Close notifications popover on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </label>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="navbar-icon-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell size={19} strokeWidth={1.75} />
            {alerts.length > 0 && <span className="navbar-icon-dot" />}
          </button>

          {showNotifications && (
            <div className="navbar-notifications-menu">
              <div className="navbar-notifications-header">
                <span className="navbar-notifications-title">Notifications</span>
                <span className="navbar-notifications-badge">
                  {alerts.length} alert{alerts.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="navbar-notifications-body">
                {alerts.length === 0 ? (
                  <div className="navbar-notification-empty">
                    <CheckCircle size={18} color="var(--color-emerald)" />
                    <p>All budgets are within limits!</p>
                  </div>
                ) : (
                  alerts.map((b) => (
                    <div key={b.id} className="navbar-notification-item">
                      <AlertTriangle
                        size={16}
                        color={b.exceeded ? 'var(--color-rust)' : 'var(--color-amber)'}
                      />
                      <div className="navbar-notification-text">
                        <p className="navbar-notification-msg">
                          <strong>{b.category}</strong>:{' '}
                          {b.exceeded
                            ? `Exceeded by ${formatCurrency(b.exceededBy)}`
                            : `${b.percentSpent}% of budget used`}
                        </p>
                        <span className="navbar-notification-time">Monthly alert</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                className="navbar-notifications-footer-btn"
                onClick={() => {
                  setShowNotifications(false)
                  navigate('/budgets')
                }}
              >
                View Budgets <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="navbar-profile"
          onClick={() => navigate('/settings')}
          style={{ cursor: 'pointer' }}
          title="Go to Settings"
        >
          <div className="navbar-avatar">{userInitial}</div>
          <span className="navbar-profile-name">{userName}</span>
        </div>
      </div>
    </header>
  )
}

