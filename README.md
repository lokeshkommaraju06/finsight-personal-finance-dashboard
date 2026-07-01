# Ledger — Expense Dashboard (Step 1)

Modern, responsive dashboard shell: Navbar + Sidebar + Dashboard page.
Built with React + Vite + Tailwind CSS. Transactions are intentionally not implemented yet.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## What's in this step

- Project scaffolding (Vite + Tailwind, no CRA)
- Responsive `Sidebar` (collapses to a slide-over on mobile, static on desktop)
- `Navbar` with search and profile placeholder
- `Dashboard` page with summary stat cards and a category breakdown
- An honest empty state where the transaction list will go next

## Folder structure

```
src/
  components/
    layout/       Navbar, Sidebar, DashboardLayout (page shell)
    ui/            Reusable Card, StatCard
  pages/           Dashboard.jsx (one file per route)
  data/            mockData.js (placeholder summary data)
  App.jsx          Wires layout + page together
  main.jsx         React entry point
  index.css        Tailwind layers + base styles
```

## Next steps (not built yet)

- Transactions page + table
- Real routing (react-router-dom) once more than one page exists
- Connect stat cards / category chart to real data
