export const summaryStats = [
  { label: 'Total Balance', value: '$24,318.50', change: '+4.2% this month', tone: 'emerald' },
  { label: 'Income', value: '$8,240.00', change: '+2.1% this month', tone: 'emerald' },
  { label: 'Expenses', value: '$3,927.15', change: '+6.8% this month', tone: 'rust' },
  { label: 'Savings', value: '$4,312.85', change: 'On track', tone: 'neutral' },
]

// Aggregate category shares only — individual transactions arrive in a later step.
export const spendingByCategory = [
  { label: 'Housing', amount: 1450, share: 37 },
  { label: 'Food & Dining', amount: 620, share: 16 },
  { label: 'Transport', amount: 410, share: 10 },
  { label: 'Utilities', amount: 380, share: 10 },
  { label: 'Entertainment', amount: 290, share: 7 },
  { label: 'Other', amount: 777.15, share: 20 },
]
