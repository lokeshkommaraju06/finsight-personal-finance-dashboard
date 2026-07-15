import { useState } from 'react'
import { Plus, PiggyBank } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import BudgetCard from '../components/budgets/BudgetCard.jsx'
import BudgetFormModal from '../components/budgets/BudgetFormModal.jsx'
import { useBudgets } from '../context/BudgetsContext.jsx'

export default function Budgets() {
  const { budgets, budgetSummary, addBudget, updateBudget, deleteBudget } = useBudgets()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  function openAddModal() {
    setEditingBudget(null)
    setIsModalOpen(true)
  }

  function openEditModal(budget) {
    setEditingBudget(budget)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingBudget(null)
  }

  function handleSubmit(formData) {
    if (editingBudget) {
      updateBudget(editingBudget.id, formData)
    } else {
      addBudget(formData)
    }
    closeModal()
  }

  function handleDelete(budget) {
    const confirmed = window.confirm(
      `Delete the "${budget.category}" budget? This cannot be undone.`
    )
    if (confirmed) {
      deleteBudget(budget.id)
    }
  }

  return (
    <div className="budgets-page">
      <Card className="budgets-toolbar">
        <p className="budgets-toolbar-copy">
          Set a monthly limit per category and track spending against it.
        </p>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2} />
          Add Budget
        </button>
      </Card>

      {budgetSummary.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">
              <PiggyBank size={20} strokeWidth={1.75} />
            </div>
            <h3 className="empty-state-title">No budgets yet</h3>
            <p className="empty-state-body">
              Add your first budget to start tracking spending by category.
            </p>
          </div>
        </Card>
      ) : (
        <div className="budgets-grid">
          {budgetSummary.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <BudgetFormModal
          budget={editingBudget}
          existingBudgets={budgets}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
