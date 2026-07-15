import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { BUDGET_CATEGORIES } from '../../data/budgetCategories.js'

const emptyForm = { category: '', amount: '' }

// Handles both "Add" and "Edit" — pass a `budget` to pre-fill the form
// and switch it into edit mode, same pattern as AddTransactionModal.
export default function BudgetFormModal({ budget, existingBudgets, onClose, onSubmit }) {
  const isEditing = Boolean(budget)

  const [form, setForm] = useState(() =>
    isEditing
      ? { category: budget.category, amount: String(budget.amount) }
      : emptyForm
  )
  const [error, setError] = useState('')

  // Categories that already have a budget (excluding this one, if we're
  // editing it) aren't offered again — that's how duplicate budgets are
  // prevented at the source, not just caught on submit.
  const takenCategories = new Set(
    existingBudgets.filter((b) => b.id !== budget?.id).map((b) => b.category)
  )
  const availableCategories = BUDGET_CATEGORIES.filter(
    (category) => !takenCategories.has(category) || category === form.category
  )

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.category) {
      setError('Please choose a category.')
      return
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Budget amount must be greater than zero.')
      return
    }
    if (takenCategories.has(form.category)) {
      setError('That category already has a budget. Edit it instead.')
      return
    }

    onSubmit({ category: form.category, amount: Number(form.amount) })
  }

  return (
    <Modal title={isEditing ? 'Edit Budget' : 'Add Budget'} onClose={onClose}>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="form-label">Category</span>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="form-input"
            disabled={isEditing}
          >
            <option value="" disabled>
              Select a category
            </option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Monthly Budget Amount</span>
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

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Save Changes' : 'Add Budget'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
