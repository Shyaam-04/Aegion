export default function RiskBadge({ level, size = 'sm' }) {
  const config = {
    high: { bg: 'bg-risk-high/10', text: 'text-risk-high', border: 'border-risk-high/30', label: 'High Risk' },
    medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', border: 'border-risk-medium/30', label: 'Medium Risk' },
    low: { bg: 'bg-risk-low/10', text: 'text-risk-low', border: 'border-risk-low/30', label: 'Low Risk' },
  }

  const c = config[level] || config.low

  const sizeClass = size === 'lg'
    ? 'text-xs px-3 py-1.5 font-semibold'
    : 'text-[11px] px-2 py-0.5 font-medium'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClass} uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {c.label}
    </span>
  )
}
