import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import TransactionFilters from '../components/transactions/TransactionFilters.jsx'
import TransactionsTable from '../components/transactions/TransactionsTable.jsx'
import AddTransactionModal from '../components/transactions/AddTransactionModal.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => typeFilter === 'All' || t.type === typeFilter)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, search, typeFilter])

  function openAddModal() {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  function openEditModal(transaction) {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  function handleSubmit(formData) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, formData)
    } else {
      addTransaction(formData)
    }
    closeModal()
  }

  function handleDelete(transaction) {
    const confirmed = window.confirm(
      `Delete "${transaction.title}"? This cannot be undone.`
    )
    if (confirmed) {
      deleteTransaction(transaction.id)
    }
  }

  return (
    <div className="transactions-page">
      <Card className="transactions-toolbar">
        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} strokeWidth={2} />
          Add Transaction
        </button>
      </Card>

      <Card>
        {transactions.length === 0 ? (
          <div className="table-empty">
            <p>No transactions found. Add your first transaction.</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="table-empty">
            <p>No transactions match your search.</p>
          </div>
        ) : (
          <TransactionsTable
            transactions={filteredTransactions}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {isModalOpen && (
        <AddTransactionModal
          transaction={editingTransaction}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
