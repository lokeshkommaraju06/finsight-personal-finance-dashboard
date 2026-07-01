import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import { TransactionsProvider } from './context/TransactionsContext.jsx'

export default function App() {
  return (
    <TransactionsProvider>
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
        </Routes>
      </BrowserRouter>
    </TransactionsProvider>
  )
}
