// Formats a number as US currency, e.g. formatCurrency(1450) -> "$1,450.00"
export function formatCurrency(amount) {
  const value = Number(amount) || 0
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Formats an ISO date string, e.g. formatDate('2026-06-25') -> "Jun 25, 2026"
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
