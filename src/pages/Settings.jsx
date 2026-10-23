import { useState } from 'react'
import {
  User,
  CheckCircle,
  Save,
} from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import {
  useSettings,
  AVAILABLE_CURRENCIES,
  DATE_FORMAT_OPTIONS,
} from '../context/SettingsContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function Settings() {
  const { settings, updateSettings } = useSettings()

  // Form states
  const [userName, setUserName] = useState(settings.userName || 'Aditi')
  const [userEmail, setUserEmail] = useState(settings.userEmail || 'aditi.finance@example.com')
  const [currency, setCurrency] = useState(settings.currency || 'USD')
  const [currencyPosition, setCurrencyPosition] = useState(
    settings.currencyPosition || 'prefix'
  )
  const [dateFormat, setDateFormat] = useState(
    settings.dateFormat || 'MMM DD, YYYY'
  )

  // Feedback toast
  const [toastMessage, setToastMessage] = useState('')

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    updateSettings({
      userName: userName.trim() || 'Aditi',
      userEmail: userEmail.trim(),
      currency,
      currencyPosition,
      dateFormat,
    })
    showToast('Profile and display preferences saved successfully!')
  }

  const selectedCurrencySymbol =
    AVAILABLE_CURRENCIES.find((c) => c.code === currency)?.symbol || '$'

  return (
    <div className="settings-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="settings-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile & Display Settings */}
      <Card>
        <div className="settings-card-header">
          <div className="settings-card-icon">
            <User size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="category-card-title">Profile & Display</h2>
            <p className="navbar-subtitle">Personalize your name, currency, and date formats</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="settings-form">
          <div className="settings-form-row">
            <label className="form-field" style={{ flex: 1 }}>
              <span className="form-label">Display Name</span>
              <input
                type="text"
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Aditi"
                required
              />
            </label>

            <label className="form-field" style={{ flex: 1 }}>
              <span className="form-label">Email Address</span>
              <input
                type="email"
                className="form-input"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. aditi.finance@example.com"
              />
            </label>
          </div>

          <div className="settings-form-row">
            <label className="form-field" style={{ flex: 1 }}>
              <span className="form-label">Default Currency</span>
              <select
                className="form-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {AVAILABLE_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field" style={{ flex: 1 }}>
              <span className="form-label">Currency Symbol Position</span>
              <select
                className="form-input"
                value={currencyPosition}
                onChange={(e) => setCurrencyPosition(e.target.value)}
              >
                <option value="prefix">Prefix (e.g. $1,450.00)</option>
                <option value="suffix">Suffix (e.g. 1,450.00 $)</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span className="form-label">Date Format</span>
            <select
              className="form-input"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            >
              {DATE_FORMAT_OPTIONS.map((df) => (
                <option key={df.value} value={df.value}>
                  {df.label}
                </option>
              ))}
            </select>
          </label>

          {/* Live Preview Box */}
          <div className="settings-preview-box">
            <span className="settings-preview-label">Live Currency Preview:</span>
            <span className="nums settings-preview-value">
              {formatCurrency(1450.5, selectedCurrencySymbol, currencyPosition)}
            </span>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} strokeWidth={2} />
            Save Profile & Display
          </button>
        </form>
      </Card>
    </div>
  )
}
