import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/format.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BudgetVsActualChart({ budgetVsActual }) {
  if (!budgetVsActual || budgetVsActual.length === 0) {
    return (
      <div className="report-empty-chart">
        <p>No budgets set yet. Add budgets in the Budgets section to see comparisons.</p>
      </div>
    )
  }

  const labels = budgetVsActual.map((item) => item.category)
  const budgetData = budgetVsActual.map((item) => item.budget)
  const actualData = budgetVsActual.map((item) => item.spent)

  const data = {
    labels,
    datasets: [
      {
        label: 'Budget Limit',
        data: budgetData,
        backgroundColor: '#B8862E', // amber
        borderRadius: 4,
        maxBarThickness: 36,
      },
      {
        label: 'Actual Spent',
        data: actualData,
        backgroundColor: budgetVsActual.map((item) =>
          item.exceeded ? '#C1553D' : '#2F6F4E'
        ),
        borderRadius: 4,
        maxBarThickness: 36,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: { family: 'Inter, sans-serif', size: 12 },
          color: '#4B534E',
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
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
    <div className="chart-canvas-wrap" style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}
