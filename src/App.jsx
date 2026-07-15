import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budgets from './pages/Budgets.jsx'
import { TransactionsProvider } from './context/TransactionsContext.jsx'
import { BudgetsProvider } from './context/BudgetsContext.jsx'

export default function App() {
  return (
    <TransactionsProvider>
      <BudgetsProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardLayout title="Dashboard" subtitle="Welcome back, Aditi">
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/transactions"
              element={
                <DashboardLayout title="Transactions" subtitle="Track your income and expenses">
                  <Transactions />
                </DashboardLayout>
              }
            />
            <Route
              path="/budgets"
              element={
                <DashboardLayout title="Budgets" subtitle="Set limits and track spending by category">
                  <Budgets />
                </DashboardLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </BudgetsProvider>
    </TransactionsProvider>
  )
}
