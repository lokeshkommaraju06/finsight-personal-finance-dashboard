import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from './Card.jsx'

const toneStyles = {
  emerald: { chip: 'bg-emerald-soft text-emerald', icon: ArrowUpRight },
  rust: { chip: 'bg-rust-soft text-rust', icon: ArrowDownRight },
  neutral: { chip: 'bg-ink/5 text-ink-soft', icon: ArrowUpRight },
}

export default function StatCard({ label, value, change, tone = 'neutral' }) {
  const { chip, icon: Icon } = toneStyles[tone]

  return (
    <Card>
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="nums mt-2 font-mono text-2xl font-medium text-ink">
        {value}
      </p>
      {change && (
        <span
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${chip}`}
        >
          <Icon size={13} strokeWidth={2} />
          {change}
        </span>
      )}
    </Card>
  )
}
