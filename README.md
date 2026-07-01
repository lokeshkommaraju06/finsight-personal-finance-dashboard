# Ledger — Expense Dashboard (Step 2: Transactions)

Modern, responsive dashboard: Navbar + Sidebar + Dashboard + Transactions.
Built with React + Vite, React Router, and plain hand-written CSS (no CSS framework).
No backend, no localStorage, no database — all data lives in React state for now.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## What's in this step

- React Router (`react-router-dom`) wiring `/` (Dashboard) and `/transactions`
- A `TransactionsContext` holding all transaction state + derived stats in one place
- Transactions page: search by title, filter by All/Income/Expense, sortable-by-date table
- "Add Transaction" modal — new entries appear in the table and update Dashboard stats instantly
- Sidebar now links to Dashboard and Transactions; Budgets and Reports are marked "Coming Soon"

## Folder structure

```
src/
  components/
    layout/         Navbar, Sidebar, DashboardLayout (unchanged page shell)
    ui/              Card, StatCard, Modal, Badge (generic, reusable)
    transactions/    TransactionFilters, TransactionsTable, AddTransactionModal
  pages/             Dashboard.jsx, Transactions.jsx (one file per route)
  context/           TransactionsContext.jsx — shared state + derived stats
  data/              mockTransactions.js (placeholder transaction records)
  utils/             format.js (formatCurrency, formatDate helpers)
  App.jsx            Router + TransactionsProvider + route definitions
  main.jsx           React entry point
  index.css          Design tokens (CSS variables) + all component styles
```

## How the data flows

`TransactionsProvider` (in `App.jsx`) wraps the whole app, so both the Dashboard
and Transactions pages read from — and can update — the same list of
transactions via the `useTransactions()` hook. Adding a transaction on the
Transactions page updates the shared state, and the Dashboard's stat cards
and category breakdown (which are computed with `useMemo`) recalculate
automatically on the next render. No manual syncing needed.

## Next steps (not built yet)

- Persisting transactions (localStorage, then a real backend)
- Budgets and Reports pages
- Editing/deleting transactions
