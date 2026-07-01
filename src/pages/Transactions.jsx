import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import TransactionFilters from '../components/transactions/TransactionFilters.jsx'
import TransactionsTable from '../components/transactions/TransactionsTable.jsx'
import AddTransactionModal from '../components/transactions/AddTransactionModal.jsx'
import { useTransactions } from '../context/TransactionsContext.jsx'

export default function Transactions() {
  const { transactions, addTransaction } = useTransactions()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => typeFilter === 'All' || t.type === typeFilter)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, search, typeFilter])

  function handleAddTransaction(transaction) {
    addTransaction(transaction)
    setIsModalOpen(false)
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
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          Add Transaction
        </button>
      </Card>

      <Card>
        <TransactionsTable transactions={filteredTransactions} />
      </Card>

      {isModalOpen && (
        <AddTransactionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  )
}
