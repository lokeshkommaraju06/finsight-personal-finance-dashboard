import { useState, useRef } from 'react'
import {
  User,
  Download,
  Upload,

  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Save,
  ShieldAlert,
  Sparkles,
  Sliders,
  Database,
} from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import {
  useSettings,
  AVAILABLE_CURRENCIES,
  DATE_FORMAT_OPTIONS,
} from '../context/SettingsContext.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'
import { useBudgets } from '../context/BudgetsContext.jsx'
import { CATEGORY_OPTIONS } from '../data/mockTransactions.js'
import { formatCurrency } from '../utils/format.js'
import {
  exportTransactionsCSV,
  exportBudgetsCSV,
  exportFullBackupJSON,
} from '../utils/calculateReports.js'
import { clearAllStoredData } from '../utils/storage.js'

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const {
    transactions,
    resetTransactions,
    clearTransactions,
    importTransactions,
  } = useTransactions()
  const {
    budgets,
    resetBudgets,
    clearBudgets,
    importBudgets,
  } = useBudgets()

  // Form states
  const [userName, setUserName] = useState(settings.userName || 'Aditi')
  const [userEmail, setUserEmail] = useState(settings.userEmail || 'aditi@example.com')
  const [currency, setCurrency] = useState(settings.currency || 'USD')
  const [currencyPosition, setCurrencyPosition] = useState(
    settings.currencyPosition || 'prefix'
  )
  const [dateFormat, setDateFormat] = useState(
    settings.dateFormat || 'MMM DD, YYYY'
  )
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useState(
    settings.budgetAlertThreshold || 90
  )
  const [defaultTransactionType, setDefaultTransactionType] = useState(
    settings.defaultTransactionType || 'Expense'
  )
  const [defaultCategory, setDefaultCategory] = useState(
    settings.defaultCategory || 'Food & Dining'
  )

  // Feedback toast
  const [toastMessage, setToastMessage] = useState('')

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: null,
  })

  // File import ref
  const fileInputRef = useRef(null)

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
    showToast('Profile and currency preferences saved successfully!')
  }

  function handleSavePreferences(e) {
    e.preventDefault()
    updateSettings({
      budgetAlertThreshold: Number(budgetAlertThreshold),
      defaultTransactionType,
      defaultCategory,
    })
    showToast('Budget and transaction defaults saved successfully!')
  }

  function handleExportBackup() {
    exportFullBackupJSON(transactions, budgets, settings)
    showToast('Complete backup JSON downloaded!')
  }

  function handleExportTransactions() {
    exportTransactionsCSV(transactions)
    showToast('Transactions CSV exported!')
  }

  function handleExportBudgets() {
    exportBudgetsCSV(budgets)
    showToast('Budgets CSV exported!')
  }

  function handleFileImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format.')
        }

        const txCount = Array.isArray(parsed.transactions) ? parsed.transactions.length : 0
        const bgCount = Array.isArray(parsed.budgets) ? parsed.budgets.length : 0

        setConfirmModal({
          isOpen: true,
          title: 'Import Backup File',
          message: `Found ${txCount} transactions and ${bgCount} budgets in "${file.name}". Do you want to import this data? Current data will be replaced.`,
          confirmText: 'Import Data',
          onConfirm: () => {
            if (Array.isArray(parsed.transactions)) {
              importTransactions(parsed.transactions)
            }
            if (Array.isArray(parsed.budgets)) {
              importBudgets(parsed.budgets)
            }
            if (parsed.settings && typeof parsed.settings === 'object') {
              updateSettings(parsed.settings)
              if (parsed.settings.userName) setUserName(parsed.settings.userName)
              if (parsed.settings.userEmail) setUserEmail(parsed.settings.userEmail)
              if (parsed.settings.currency) setCurrency(parsed.settings.currency)
            }
            setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
            showToast(`Imported ${txCount} transactions and ${bgCount} budgets successfully!`)
          },
        })
      } catch (err) {
        alert('Failed to parse JSON file. Please ensure it is a valid FinSight backup.')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  function handleRestoreSampleData() {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Sample Data',
      message:
        'This will reset your transactions and budgets back to the initial sample dataset. Any custom entries will be replaced.',
      confirmText: 'Restore Sample Data',
      onConfirm: () => {
        resetTransactions()
        resetBudgets()
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
        showToast('Sample transactions and budgets restored!')
      },
    })
  }

  function handleClearTransactions() {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Transactions',
      message:
        'Are you sure you want to delete ALL transactions? This action cannot be undone.',
      confirmText: 'Delete All Transactions',
      onConfirm: () => {
        clearTransactions()
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
        showToast('All transactions have been deleted.')
      },
    })
  }

  function handleClearBudgets() {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Budgets',
      message:
        'Are you sure you want to delete ALL budget limits? This action cannot be undone.',
      confirmText: 'Delete All Budgets',
      onConfirm: () => {
        clearBudgets()
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
        showToast('All budgets have been removed.')
      },
    })
  }

  function handleFactoryReset() {
    setConfirmModal({
      isOpen: true,
      title: 'Factory Reset All Data',
      message:
        'WARNING: This will wipe all transactions, all budgets, and restore default settings. You will start with a clean slate. Are you absolutely certain?',
      confirmText: 'Reset Everything',
      onConfirm: () => {
        clearTransactions()
        clearBudgets()
        resetSettings()
        clearAllStoredData()
        setUserName('Aditi')
        setUserEmail('aditi@example.com')
        setCurrency('USD')
        setCurrencyPosition('prefix')
        setDateFormat('MMM DD, YYYY')
        setBudgetAlertThreshold(90)
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
        showToast('Application reset to factory defaults.')
      },
    })
  }

  return (
    <div className="settings-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="settings-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid of Settings Cards */}
      <div className="settings-grid">
        {/* Profile & Currency Settings */}
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
                  placeholder="e.g. aditi@example.com"
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
                {formatCurrency(
                  1450.5,
                  AVAILABLE_CURRENCIES.find((c) => c.code === currency)?.symbol || '$',
                  currencyPosition
                )}
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Save size={16} strokeWidth={2} />
              Save Profile & Display
            </button>
          </form>
        </Card>

        {/* Budget & Defaults Preferences */}
        <Card>
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Sliders size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="category-card-title">Budgeting & Defaults</h2>
              <p className="navbar-subtitle">Set threshold warnings and default entry values</p>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="settings-form">
            <label className="form-field">
              <span className="form-label">
                Budget Alert Threshold: {budgetAlertThreshold}%
              </span>
              <div className="settings-range-wrap">
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={budgetAlertThreshold}
                  onChange={(e) => setBudgetAlertThreshold(e.target.value)}
                  className="settings-range-slider"
                />
                <span className="nums settings-range-badge">{budgetAlertThreshold}%</span>
              </div>
              <p className="settings-helper-text">
                Flags a category in yellow/red when spending reaches this percentage of budget.
              </p>
            </label>

            <div className="settings-form-row">
              <label className="form-field" style={{ flex: 1 }}>
                <span className="form-label">Default Transaction Type</span>
                <select
                  className="form-input"
                  value={defaultTransactionType}
                  onChange={(e) => setDefaultTransactionType(e.target.value)}
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </label>

              <label className="form-field" style={{ flex: 1 }}>
                <span className="form-label">Default Category</span>
                <select
                  className="form-input"
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Save size={16} strokeWidth={2} />
              Save Preferences
            </button>
          </form>
        </Card>

        {/* Data Backup & Management */}
        <Card>
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Database size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="category-card-title">Data Backup & Export</h2>
              <p className="navbar-subtitle">Export your records for spreadsheets or local backup</p>
            </div>
          </div>

          <div className="settings-actions-list">
            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Full Backup (JSON)</p>
                <p className="settings-action-desc">
                  Download all transactions, active budgets, and app settings into a single backup file.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleExportBackup}
              >
                <Download size={15} />
                Export JSON
              </button>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Export Transactions (CSV)</p>
                <p className="settings-action-desc">
                  Download all {transactions.length} transactions formatted for Excel, Google Sheets, or Numbers.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleExportTransactions}
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Export Budgets (CSV)</p>
                <p className="settings-action-desc">
                  Download all {budgets.length} budget limit categories as a spreadsheet.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleExportBudgets}
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Restore / Import Backup</p>
                <p className="settings-action-desc">
                  Upload a previously exported FinSight JSON backup file to restore your data.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                  onChange={handleFileImport}
                />
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  Import JSON
                </button>
              </div>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Sample Demo Data</p>
                <p className="settings-action-desc">
                  Populate the dashboard with initial sample transactions and category budgets.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleRestoreSampleData}
              >
                <Sparkles size={15} />
                Load Sample Data
              </button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="settings-danger-card">
          <div className="settings-card-header">
            <div className="settings-card-icon settings-card-icon--danger">
              <ShieldAlert size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="category-card-title" style={{ color: 'var(--color-rust)' }}>
                Danger Zone
              </h2>
              <p className="navbar-subtitle">Irreversible actions on your saved financial data</p>
            </div>
          </div>

          <div className="settings-actions-list">
            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Clear Transactions</p>
                <p className="settings-action-desc">
                  Removes all {transactions.length} transactions from local storage.
                </p>
              </div>
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={handleClearTransactions}
              >
                <Trash2 size={15} />
                Clear Transactions
              </button>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Clear Budgets</p>
                <p className="settings-action-desc">
                  Removes all {budgets.length} category budgets from local storage.
                </p>
              </div>
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={handleClearBudgets}
              >
                <Trash2 size={15} />
                Clear Budgets
              </button>
            </div>

            <div className="settings-action-row">
              <div>
                <p className="settings-action-title">Factory Reset Everything</p>
                <p className="settings-action-desc">
                  Permanently deletes all transactions, budgets, and resets all settings to defaults.
                </p>
              </div>
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={handleFactoryReset}
              >
                <RotateCcw size={15} />
                Reset App
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <Modal
          title={confirmModal.title}
          onClose={() =>
            setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
          }
        >
          <div className="confirm-modal-body">
            <div className="confirm-modal-warning">
              <AlertTriangle size={24} />
              <p>{confirmModal.message}</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    title: '',
                    message: '',
                    onConfirm: null,
                  })
                }
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary btn-danger"
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
