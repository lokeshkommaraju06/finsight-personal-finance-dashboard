import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Aditi">
      <Dashboard />
    </DashboardLayout>
  )
}
