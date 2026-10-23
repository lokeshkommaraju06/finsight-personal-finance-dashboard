import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredSettings, setStoredSettings } from '../utils/storage.js'

export const AVAILABLE_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
]

export const DATE_FORMAT_OPTIONS = [
  { value: 'MMM DD, YYYY', label: 'Jun 25, 2026 (MMM DD, YYYY)' },
  { value: 'DD/MM/YYYY', label: '25/06/2026 (DD/MM/YYYY)' },
  { value: 'YYYY-MM-DD', label: '2026-06-25 (YYYY-MM-DD)' },
]

export const defaultSettings = {
  userName: 'Aditi',
  userEmail: 'aditi.finance@example.com',
  currency: 'USD',
  currencySymbol: '$',
  currencyPosition: 'prefix',
  dateFormat: 'MMM DD, YYYY',
  budgetAlertThreshold: 90,
  defaultTransactionType: 'Expense',
  defaultCategory: 'Food & Dining',
  theme: 'system',
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = getStoredSettings()
    return stored ? { ...defaultSettings, ...stored } : defaultSettings
  })

  // Synchronize with localStorage
  useEffect(() => {
    setStoredSettings(settings)
  }, [settings])

  function updateSettings(updatedFields) {
    setSettings((prev) => {
      const next = { ...prev, ...updatedFields }
      // If currency changed, auto-update the symbol if not explicitly provided
      if (updatedFields.currency && !updatedFields.currencySymbol) {
        const found = AVAILABLE_CURRENCIES.find((c) => c.code === updatedFields.currency)
        if (found) {
          next.currencySymbol = found.symbol
        }
      }
      setStoredSettings(next)
      return next
    })
  }

  function resetSettings() {
    setSettings(defaultSettings)
    setStoredSettings(defaultSettings)
  }

  const value = {
    settings,
    updateSettings,
    resetSettings,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used inside a <SettingsProvider>')
  }
  return context
}
