import { TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react'
import { formatCurrency } from '../../utils/format.js'

export default function FinancialInsightsCard({
  metrics,
  categoryBreakdown,
  budgetVsActual,
}) {
  const insights = []

  // Savings rate insight
  if (metrics.savingsRate >= 30) {
    insights.push({
      icon: TrendingUp,
      tone: 'emerald',
      title: 'Strong Savings Habit',
      desc: `You are saving ${metrics.savingsRate}% of your total income. Financial advisors generally recommend a 20%+ savings rate.`,
    })
  } else if (metrics.savingsRate > 0) {
    insights.push({
      icon: TrendingUp,
      tone: 'amber',
      title: 'Positive Cash Flow',
      desc: `You have saved ${formatCurrency(metrics.netSavings)} (${metrics.savingsRate}% of income) in this period. Consider reviewing discretionary spend to reach a 20% target.`,
    })
  } else if (metrics.totalIncome > 0 && metrics.netSavings < 0) {
    insights.push({
      icon: AlertTriangle,
      tone: 'rust',
      title: 'Spending Exceeded Income',
      desc: `Your expenses exceeded income by ${formatCurrency(Math.abs(metrics.netSavings))}. Review high-cost items to avoid dipping into reserves.`,
    })
  }

  // Top spending category insight
  if (categoryBreakdown.length > 0) {
    const topCat = categoryBreakdown[0]
    insights.push({
      icon: Lightbulb,
      tone: 'neutral',
      title: `Largest Outflow: ${topCat.category}`,
      desc: `${topCat.category} represents ${topCat.share}% (${formatCurrency(topCat.amount)}) of all spending in this period.`,
    })
  }

  // Budget adherence insight
  if (budgetVsActual.length > 0) {
    const exceededList = budgetVsActual.filter((b) => b.exceeded)
    if (exceededList.length === 0) {
      insights.push({
        icon: CheckCircle2,
        tone: 'emerald',
        title: 'All Budgets Respected',
        desc: `Great job! None of your ${budgetVsActual.length} budget categories exceeded their limits during this timeframe.`,
      })
    } else {
      const names = exceededList.map((b) => b.category).join(', ')
      insights.push({
        icon: AlertTriangle,
        tone: 'rust',
        title: `${exceededList.length} Budget Overrun${exceededList.length > 1 ? 's' : ''}`,
        desc: `${names} exceeded allotted spending limits. Look at these categories to adjust targets or reduce unnecessary costs.`,
      })
    }
  }

  return (
    <div className="report-insights-list">
      {insights.map((item, idx) => {
        const Icon = item.icon
        return (
          <div key={idx} className={`report-insight-item report-insight-item--${item.tone}`}>
            <div className="report-insight-icon-wrap">
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="report-insight-body">
              <h4 className="report-insight-title">{item.title}</h4>
              <p className="report-insight-desc">{item.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
