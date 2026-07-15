# Ledger — Expense Dashboard (Step 5: Budget Management)

Modern, responsive dashboard: Navbar + Sidebar + Dashboard + Transactions +
Budgets. Built with React + Vite, React Router, Chart.js, and plain
hand-written CSS (no CSS framework). No backend, no Firebase, no database —
everything persists in the browser's localStorage only.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## What's in this step (Step 5)

- New **Budgets** page (`/budgets`), linked from the sidebar
- Create a monthly budget per category (Food, Shopping, Travel, Bills,
  Entertainment, Healthcare, Others) — one budget per category, enforced
  at the form level (a category already budgeted isn't offered again)
- Each **budget card** shows Budget, Spent, and Remaining, plus a
  color-coded progress bar: green (0–60%), yellow (60–90%), red (90%+),
  with a "Budget Exceeded" message and the exact overage when spending
  passes the budget
- Spend per category is calculated from the real transaction list (via a
  small category-name mapping in `data/budgetCategories.js`), so it stays
  live as transactions are added, edited, or deleted
- Edit (amount only) and Delete on every budget card, delete asks for
  confirmation first
- Validation on the Add/Edit form: no empty category, no zero/negative
  amount, no duplicate category budgets — with friendly inline messages
- Dashboard gains two more cards: **Total Budget** and **Total Remaining
  Budget**, both derived automatically from the budget list
- Budgets grid is 1 column on mobile, 2 on tablet, 3 on desktop — no
  horizontal scrolling at any width

## What was in Step 4

- **Expense by Category** doughnut chart (Chart.js) — categories and totals
  come from the same `calculateCategoryBreakdown` data the app already uses,
  with a stable, visually distinct color per category
- **Income vs Expense** bar chart — reads directly from `stats.income` /
  `stats.expenses`, so it updates the moment a transaction is added, edited,
  or deleted
- **Recent Transactions** card — latest 5 transactions (category, title,
  amount, date) with a "View All" button that routes to `/transactions`
- **Quick Statistics** — Highest Expense, Highest Income, and Average
  Transaction Amount, calculated by `calculateQuickStats()`, no hardcoded values
- Charts and cards stack vertically on mobile and sit side-by-side on
  desktop (`≥1024px`), with no horizontal scrolling

## What was in Step 3

- Transactions persist to `localStorage` and survive a page reload
- On first visit (empty localStorage), the app seeds itself with mock data
- Edit button on every row — reopens the same Add/Edit modal, pre-filled
- Delete button on every row — asks for confirmation before removing anything
- Dashboard cards (Total Income, Total Expenses, Current Balance, Total
  Transactions) are fully derived from the transaction list — no hardcoded numbers
- Clean empty state ("No transactions found. Add your first transaction.")
  when the list is empty, separate from the "no search results" message

## Folder structure

```
src/
  components/
    layout/         Navbar, Sidebar, DashboardLayout (unchanged page shell)
    ui/              Card, StatCard, Modal, Badge (generic, reusable)
    transactions/    TransactionFilters, TransactionsTable, AddTransactionModal (add + edit)
    dashboard/       ExpenseCategoryChart, IncomeExpenseChart, RecentTransactionsCard (Step 4)
    budgets/         BudgetCard, BudgetFormModal (add + edit) (Step 5)
  pages/             Dashboard.jsx, Transactions.jsx, Budgets.jsx (one file per route)
  context/           TransactionsContext.jsx, BudgetsContext.jsx — shared state,
                     persistence, derived stats (BudgetsContext reads live
                     transactions to calculate spend per category)
  data/              mockTransactions.js (seed data, first visit only),
                     budgetCategories.js (budget category list + category-name mapping)
  utils/
    format.js            formatCurrency, formatDate
    storage.js           getStoredTransactions/setStoredTransactions,
                         getStoredBudgets/setStoredBudgets (localStorage)
    calculateStats.js    calculateDashboardStats, calculateCategoryBreakdown,
                         calculateQuickStats, getRecentTransactions
    calculateBudget.js   calculateSpentForCategory, calculateBudgetSummary,
                         calculateBudgetTotals, getBudgetStatus
    chartData.js         getExpenseCategoryChartData, getIncomeExpenseChartData,
                         getCategoryColor — shapes stats/breakdown into Chart.js datasets
  App.jsx            Router + TransactionsProvider + BudgetsProvider + routes
  main.jsx           React entry point
  index.css          Design tokens (CSS variables) + all component styles
```

## How the data flows

`TransactionsProvider` reads from `localStorage` once on startup (falling
back to the mock data the very first time), and writes back to
`localStorage` automatically whenever the transaction list changes — via a
single `useEffect`. Add, edit, and delete all go through the same
`transactions` state, so the Dashboard's stats and category breakdown
(computed with `calculateDashboardStats` / `calculateCategoryBreakdown` in
`utils/calculateStats.js`) recalculate on every change, with no manual
syncing and no duplicated math.

## Next steps (not built yet)

- Reports page
- A real backend

