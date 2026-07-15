import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { getExpenseCategoryChartData } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// Renders the "Expense by Category" doughnut. Categories and their
// totals come straight from `categoryBreakdown` (calculateCategoryBreakdown),
// so the chart updates automatically whenever transactions change.
export default function ExpenseCategoryChart({ categoryBreakdown }) {
  if (categoryBreakdown.length === 0) {
    return <p className="category-empty">No expenses recorded yet.</p>
  }

  const data = getExpenseCategoryChartData(categoryBreakdown)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 14,
          font: { family: 'Inter, sans-serif', size: 12 },
          color: '#4B534E',
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
  }

  return (
    <div className="chart-canvas-wrap">
      <Doughnut data={data} options={options} />
    </div>
  )
}
