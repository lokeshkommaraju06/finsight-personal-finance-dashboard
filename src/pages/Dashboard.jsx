import { Inbox } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import { summaryStats, spendingByCategory } from '../data/mockData.js'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Spending by category */}
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Spending by category</h2>
            <span className="text-xs uppercase tracking-wide text-ink-faint">This month</span>
          </div>

          <div className="space-y-4">
            {spendingByCategory.map((cat) => (
              <div key={cat.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{cat.label}</span>
                  <span className="nums font-mono text-ink">
                    ${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity — honest empty state, transactions land in a later step */}
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink-faint">
            <Inbox size={20} strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 font-display text-base text-ink">No recent activity yet</h3>
          <p className="mt-1 max-w-[22ch] text-sm text-ink-soft">
            Transaction history will show up here once accounts are connected.
          </p>
        </Card>
      </div>
    </div>
  )
}
