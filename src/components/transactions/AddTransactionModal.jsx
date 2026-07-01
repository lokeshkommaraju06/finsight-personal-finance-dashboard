import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { CATEGORY_OPTIONS } from '../../data/mockTransactions.js'

const emptyForm = {
  title: '',
  amount: '',
  category: CATEGORY_OPTIONS[0],
  type: 'Expense',
  date: new Date().toISOString().slice(0, 10),
}

export default function AddTransactionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim() || !form.amount || !form.date) {
      setError('Please fill in title, amount, and date.')
      return
    }
    if (Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.')
      return
    }

    onSubmit({
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
    })
  }

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="form-label">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g. Grocery shopping"
            className="form-input"
          />
        </label>

        <label className="form-field">
          <span className="form-label">Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange('amount')}
            placeholder="0.00"
            className="form-input"
          />
        </label>

        <label className="form-field">
          <span className="form-label">Category</span>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="form-input"
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Type</span>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="form-input"
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Date</span>
          <input
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className="form-input"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Transaction
          </button>
        </div>
      </form>
    </Modal>
  )
}
