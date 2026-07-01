import { createContext, useContext, useMemo, useState } from 'react'
import { initialTransactions } from '../data/mockTransactions.js'

// A placeholder "starting balance" to make Total Balance look like a real
// account total rather than just this month's net. No backend involved —
// this is just a constant so the number is meaningful.
const STARTING_BALANCE = 20000

const TransactionsContext = createContext(null)

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions)

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: `t-${Date.now()}`,
    }
    // Newest first, so it shows up immediately at the top of the table.
    setTransactions((prev) => [newTransaction, ...prev])
  }

  // Recomputes automatically whenever `transactions` changes —
  // this is how the Dashboard stays in sync with new transactions.
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      totalBalance: STARTING_BALANCE + income - expenses,
      income,
      expenses,
      savings: income - expenses,
    }
  }, [transactions])

  const categoryBreakdown = useMemo(() => {
    const totals = {}

    transactions
      .filter((t) => t.type === 'Expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
      })

    const totalExpenses = Object.values(totals).reduce((sum, n) => sum + n, 0) || 1

    return Object.entries(totals)
      .map(([label, amount]) => ({
        label,
        amount,
        share: Math.round((amount / totalExpenses) * 100),
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const value = { transactions, addTransaction, stats, categoryBreakdown }

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
