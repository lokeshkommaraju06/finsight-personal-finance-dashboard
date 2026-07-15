import { Pencil, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'

// Assumes `transactions` is already filtered/non-empty — Transactions.jsx
// decides what to render when there's nothing to show, so that empty-state
// logic lives in exactly one place.
export default function TransactionsTable({ transactions, onEdit, onDelete }) {
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
            <th className="actions-col">Actions</th>
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
              <td className="actions-col">
                <div className="table-actions">
                  <button
                    className="table-action-btn"
                    onClick={() => onEdit(t)}
                    aria-label={`Edit ${t.title}`}
                  >
                    <Pencil size={15} strokeWidth={1.75} />
                  </button>
                  <button
                    className="table-action-btn table-action-btn--danger"
                    onClick={() => onDelete(t)}
                    aria-label={`Delete ${t.title}`}
                  >
                    <Trash2 size={15} strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
