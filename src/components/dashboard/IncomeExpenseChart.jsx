import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getIncomeExpenseChartData } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

// Renders the "Income vs Expense" bar chart. Reads straight from the same
// `stats` object (calculateDashboardStats) the summary cards use, so it
// updates automatically whenever transactions change.
export default function IncomeExpenseChart({ stats }) {
  const data = getIncomeExpenseChartData(stats)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrency(ctx.raw),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter, sans-serif', size: 12 }, color: '#4B534E' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(31, 36, 33, 0.06)' },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 11 },
          color: '#8A8F8A',
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }

  return (
    <div className="chart-canvas-wrap">
      <Bar data={data} options={options} />
    </div>
  )
}
