import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from './Card.jsx'

const toneStyles = {
  emerald: { chipClass: 'stat-card-change--emerald', icon: ArrowUpRight },
  rust: { chipClass: 'stat-card-change--rust', icon: ArrowDownRight },
  neutral: { chipClass: 'stat-card-change--neutral', icon: ArrowUpRight },
}

export default function StatCard({ label, value, change, tone = 'neutral' }) {
  const { chipClass, icon: Icon } = toneStyles[tone]

  return (
    <Card>
      <p className="stat-card-label">{label}</p>
      <p className="nums stat-card-value">{value}</p>
      {change && (
        <span className={`stat-card-change ${chipClass}`}>
          <Icon size={13} strokeWidth={2} />
          {change}
        </span>
      )}
    </Card>
  )
}
