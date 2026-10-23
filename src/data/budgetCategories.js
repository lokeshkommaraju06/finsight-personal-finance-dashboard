// Categories a budget can be set for. Kept separate from the transaction
// CATEGORY_OPTIONS (in mockTransactions.js) so Step 2/3's Add Transaction
// form is left completely untouched.
export const BUDGET_CATEGORIES = [
  'Food',
  'Shopping',
  'Travel',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Others',
]

// Transaction categories don't share the exact same names as budget
// categories (e.g. a transaction is logged under "Food & Dining", a
// budget is set for "Food"). This map lets budget spend totals be
// calculated from the real transaction list without renaming anything
// in the existing Transactions feature. Any transaction category not
// listed here (including income categories like "Salary") falls back to
// "Others" and is excluded anyway once spend calculation filters to
// type === 'Expense'.
export const TRANSACTION_TO_BUDGET_CATEGORY = {
  'Food & Dining': 'Food',
  Shopping: 'Shopping',
  Transport: 'Travel',
  Travel: 'Travel',
  Housing: 'Bills',
  Utilities: 'Bills',
  Bills: 'Bills',
  Entertainment: 'Entertainment',
  Healthcare: 'Healthcare',
  Other: 'Others',
}

// Maps a transaction's category to the budget category its spending
// should count toward.
export function mapToBudgetCategory(transactionCategory) {
  return TRANSACTION_TO_BUDGET_CATEGORY[transactionCategory] || 'Others'
}

// Sample budgets for testing and demo purposes
export const sampleBudgets = [
  { id: 'b1', category: 'Food', amount: 500 },
  { id: 'b2', category: 'Bills', amount: 1600 },
  { id: 'b3', category: 'Travel', amount: 150 },
  { id: 'b4', category: 'Entertainment', amount: 100 },
]

