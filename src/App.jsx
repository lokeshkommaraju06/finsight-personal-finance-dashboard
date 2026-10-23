import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budgets from './pages/Budgets.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import { TransactionsProvider } from './context/TransactionsContext.jsx'
import { BudgetsProvider } from './context/BudgetsContext.jsx'
import { SettingsProvider, useSettings } from './context/SettingsContext.jsx'

function AppRoutes() {
  const { settings } = useSettings()
  const userName = settings?.userName || 'Aditi'

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            title="Dashboard"
            subtitle={`Welcome back, ${userName}`}
          >
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <DashboardLayout
            title="Transactions"
            subtitle="Track your income and expenses"
          >
            <Transactions />
          </DashboardLayout>
        }
      />
      <Route
        path="/budgets"
        element={
          <DashboardLayout
            title="Budgets"
            subtitle="Set limits and track spending by category"
          >
            <Budgets />
          </DashboardLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <DashboardLayout
            title="Financial Reports"
            subtitle="Analyze spending trends and budget performance"
          >
            <Reports />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout
            title="Settings"
            subtitle="Personalize profile, currency, and manage data"
          >
            <Settings />
          </DashboardLayout>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <TransactionsProvider>
        <BudgetsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </BudgetsProvider>
      </TransactionsProvider>
    </SettingsProvider>
  )
}
