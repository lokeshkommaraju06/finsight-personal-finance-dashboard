// Reusable localStorage helpers, kept separate from context/component logic
// so there's a single place that knows about storage keys and formats.

const TRANSACTIONS_KEY = 'finsight-transactions'
const BUDGETS_KEY = 'finsight-budgets'

// Generic read: returns the parsed value for `key`, or null if nothing is
// stored yet (or if the stored value can't be read/parsed). Both the
// transactions and budgets helpers below are thin wrappers around this,
// so there's one place that knows how to talk to localStorage.
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error)
    return null
  }
}

// Generic write: saves `value` under `key` in localStorage.
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save "${key}" to localStorage:`, error)
  }
}

// Returns the stored transactions array, or null if nothing is stored yet.
export function getStoredTransactions() {
  return readJSON(TRANSACTIONS_KEY)
}

// Saves the given transactions array to localStorage.
export function setStoredTransactions(transactions) {
  writeJSON(TRANSACTIONS_KEY, transactions)
}

// Returns the stored budgets array, or null if nothing is stored yet.
export function getStoredBudgets() {
  return readJSON(BUDGETS_KEY)
}

// Saves the given budgets array to localStorage.
export function setStoredBudgets(budgets) {
  writeJSON(BUDGETS_KEY, budgets)
}
