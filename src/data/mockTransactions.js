// Placeholder data only — no backend, no database.
// Newest transactions first so recent-activity views don't need extra sorting logic.
export const initialTransactions = [
  { id: 't12', date: '2026-06-25', title: 'Side Gig Payout', category: 'Freelance', type: 'Income', amount: 310 },
  { id: 't11', date: '2026-06-22', title: 'Ride Share', category: 'Transport', type: 'Expense', amount: 28.75 },
  { id: 't10', date: '2026-06-20', title: 'Gym Membership', category: 'Other', type: 'Expense', amount: 45 },
  { id: 't9', date: '2026-06-18', title: 'Internet Bill', category: 'Utilities', type: 'Expense', amount: 59.99 },
  { id: 't8', date: '2026-06-15', title: 'Dinner with Friends', category: 'Food & Dining', type: 'Expense', amount: 78.9 },
  { id: 't7', date: '2026-06-12', title: 'Movie Night', category: 'Entertainment', type: 'Expense', amount: 42.5 },
  { id: 't6', date: '2026-06-10', title: 'Metro Pass', category: 'Transport', type: 'Expense', amount: 65 },
  { id: 't5', date: '2026-06-08', title: 'Freelance Project', category: 'Freelance', type: 'Income', amount: 620 },
  { id: 't4', date: '2026-06-06', title: 'Electricity Bill', category: 'Utilities', type: 'Expense', amount: 94.3 },
  { id: 't3', date: '2026-06-04', title: 'Grocery Shopping', category: 'Food & Dining', type: 'Expense', amount: 186.42 },
  { id: 't2', date: '2026-06-02', title: 'Rent Payment', category: 'Housing', type: 'Expense', amount: 1450 },
  { id: 't1', date: '2026-06-01', title: 'Monthly Salary', category: 'Salary', type: 'Income', amount: 8240 },
]

// Options reused by the Add Transaction form and, later, by any filters.
export const CATEGORY_OPTIONS = [
  'Salary',
  'Freelance',
  'Housing',
  'Food & Dining',
  'Transport',
  'Utilities',
  'Entertainment',
  'Other',
]
