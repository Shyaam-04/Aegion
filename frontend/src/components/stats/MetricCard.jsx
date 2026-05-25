export default function MetricCard({ label, value, icon, color, subtitle }) {
  return (
    <div className="card-glass rounded-xl p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-medium text-txt-3 uppercase tracking-wider">{label}</span>
        {icon && <span className={color || 'text-txt-3'}>{icon}</span>}
      </div>
      <p className={`text-2xl font-bold tabular-nums ${color || 'text-txt-1'}`}>{value}</p>
      {subtitle && <p className="text-[11px] text-txt-3 mt-1">{subtitle}</p>}
    </div>
  )
}
