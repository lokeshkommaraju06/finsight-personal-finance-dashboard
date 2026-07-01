import Badge from '../ui/Badge.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'

export default function TransactionsTable({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="table-empty">
        <p>No transactions match your search.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th className="amount-col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="nums">{formatDate(t.date)}</td>
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td>
                <Badge tone={t.type === 'Income' ? 'emerald' : 'rust'}>
                  {t.type}
                </Badge>
              </td>
              <td
                className={`nums amount-col ${
                  t.type === 'Income' ? 'amount-positive' : 'amount-negative'
                }`}
              >
                {t.type === 'Income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
