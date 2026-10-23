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

export default function MonthlyTrendsChart({ trendsData }) {
  if (!trendsData.labels || trendsData.labels.length === 0) {
    return (
      <div className="report-empty-chart">
        <p>No transaction data available for this period to display monthly trends.</p>
      </div>
    )
  }

  const data = {
    labels: trendsData.labels,
    datasets: [
      {
        label: 'Income',
        data: trendsData.income,
        backgroundColor: '#2F6F4E', // emerald
        borderRadius: 4,
        maxBarThickness: 42,
      },
      {
        label: 'Expenses',
        data: trendsData.expenses,
        backgroundColor: '#C1553D', // rust
        borderRadius: 4,
        maxBarThickness: 42,
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
