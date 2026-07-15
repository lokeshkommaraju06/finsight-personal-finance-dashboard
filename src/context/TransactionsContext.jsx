import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialTransactions } from '../data/mockTransactions.js'
import { getStoredTransactions, setStoredTransactions } from '../utils/storage.js'
import {
  calculateDashboardStats,
  calculateCategoryBreakdown,
  calculateQuickStats,
} from '../utils/calculateStats.js'

const TransactionsContext = createContext(null)

export function TransactionsProvider({ children }) {
  // Lazy initializer runs once on mount: use whatever is already in
  // localStorage, or fall back to the mock data on a first-ever visit.
  const [transactions, setTransactions] = useState(() => {
    const stored = getStoredTransactions()
    return stored ?? initialTransactions
  })

  // Any time transactions change (add, edit, delete), save the full
  // list back to localStorage so a reload keeps everything.
  useEffect(() => {
    setStoredTransactions(transactions)
  }, [transactions])

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    // Newest first, so it shows up immediately at the top of the table.
    setTransactions((prev) => [newTransaction, ...prev])
  }

  function updateTransaction(id, updatedFields) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    )
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Recomputes automatically whenever `transactions` changes —
  // this is how the Dashboard stays in sync with add/edit/delete.
  const stats = useMemo(() => calculateDashboardStats(transactions), [transactions])

  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(transactions),
    [transactions]
  )

  // Highest expense, highest income, average transaction amount — for the
  // Dashboard's "Quick Statistics" cards. Same pattern as `stats` above.
  const quickStats = useMemo(() => calculateQuickStats(transactions), [transactions])

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    stats,
    categoryBreakdown,
    quickStats,
  }

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}

// Small hook so components can just call useTransactions() instead of
// importing useContext + TransactionsContext everywhere.
export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error('useTransactions must be used inside a <TransactionsProvider>')
  }
  return context
}
