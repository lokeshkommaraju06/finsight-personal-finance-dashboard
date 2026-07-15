// Chart-shaping helpers — kept separate from calculateStats.js so
// chart-specific concerns (labels, colors, dataset objects) don't mix
// into the plain dashboard-stats math. These take the same numbers the
// rest of the app already computes and reshape them for Chart.js.

// A small, visually distinct palette in the same muted/editorial family
// as the rest of the UI (built from the existing emerald/rust brand
// colors plus a few complementary tones). Categories are assigned a
// color by position, so the mapping is stable and works for *any*
// category that shows up in the data — not just a hardcoded list.
const CATEGORY_PALETTE = [
  '#2F6F4E', // emerald — existing brand color
  '#C1553D', // rust — existing brand color
  '#C9962C', // ochre
  '#3B6E8F', // slate blue
  '#8A5A83', // plum
  '#4F8A7B', // teal
  '#B5762F', // amber brown
  '#6E6A9C', // dusty indigo
]

export function getCategoryColor(index) {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]
}

// Doughnut-chart-ready data for "Expense by Category". Takes the same
// `categoryBreakdown` array (from calculateCategoryBreakdown) that the
// rest of the dashboard uses, so the numbers always match.
export function getExpenseCategoryChartData(categoryBreakdown) {
  return {
    labels: categoryBreakdown.map((c) => c.label),
    datasets: [
      {
        data: categoryBreakdown.map((c) => c.amount),
        backgroundColor: categoryBreakdown.map((_, i) => getCategoryColor(i)),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  }
}

// Bar-chart-ready data for "Income vs Expense". Takes the same `stats`
// object (from calculateDashboardStats) that the summary cards use.
export function getIncomeExpenseChartData(stats) {
  return {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [stats.income, stats.expenses],
        backgroundColor: ['#2F6F4E', '#C1553D'],
        borderRadius: 6,
        maxBarThickness: 56,
      },
    ],
  }
}
