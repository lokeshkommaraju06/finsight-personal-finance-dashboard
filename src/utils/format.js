import { getStoredSettings } from './storage.js'

// Formats a number as currency, respecting user settings or overrides
export function formatCurrency(amount, customSymbol, customPosition) {
  const settings = getStoredSettings()
  const symbol = customSymbol ?? settings?.currencySymbol ?? '$'
  const position = customPosition ?? settings?.currencyPosition ?? 'prefix'

  const value = Number(amount) || 0
  const sign = value < 0 ? '-' : ''
  const formattedNumber = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return position === 'suffix'
    ? `${sign}${formattedNumber} ${symbol}`
    : `${sign}${symbol}${formattedNumber}`
}

// Formats an ISO date string, e.g. formatDate('2026-06-25') -> "Jun 25, 2026"
export function formatDate(isoDate, style) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return isoDate

  const settings = getStoredSettings()
  const format = style ?? settings?.dateFormat ?? 'MMM DD, YYYY'

  if (format === 'DD/MM/YYYY') {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (format === 'YYYY-MM-DD') {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

