import { Clock, FileText } from 'lucide-react'
import RiskBadge from '../results/RiskBadge'

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="card-glass rounded-xl p-8 text-center">
        <FileText className="w-8 h-8 text-txt-3 mx-auto mb-2" />
        <p className="text-sm text-txt-3">No recent checks</p>
        <p className="text-xs text-txt-3 mt-0.5">Run an analysis to see history</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-txt-1">Recent Checks</h2>
        <span className="text-[11px] text-txt-3 font-medium">{history.length} records</span>
      </div>

      <div className="card-glass rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_2fr_auto_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-border text-[11px] font-medium text-txt-3 uppercase tracking-wider">
          <span>Doctor</span>
          <span>Medicines</span>
          <span>Risk</span>
          <span>Source</span>
          <span>Latency</span>
          <span>Time</span>
        </div>

        {/* Rows */}
        {history.map((check, i) => (
          <div
            key={check.id || i}
            className={`grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-4 py-3 items-center transition-colors hover:bg-surface-2/50 ${
              i !== history.length - 1 ? 'border-b border-border/50' : ''
            }`}
          >
            {/* Doctor */}
            <span className="text-sm font-medium text-txt-1 tabular-nums">
              <span className="sm:hidden text-[11px] text-txt-3 font-normal mr-1">Doctor:</span>
              {check.doctor_id}
            </span>

            {/* Medicines */}
            <div className="flex flex-wrap gap-1">
              {(check.medicines || []).map(med => (
                <span key={med} className="text-[11px] font-medium bg-surface-2 text-txt-2 px-2 py-0.5 rounded-md">
                  {med}
                </span>
              ))}
            </div>

            {/* Risk */}
            <RiskBadge level={check.risk_level} />

            {/* Source */}
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              check.source === 'llm'
                ? 'bg-accent/10 text-accent'
                : 'bg-surface-3 text-txt-3'
            }`}>
              {check.source === 'llm' ? 'LLM' : 'Fallback'}
            </span>

            {/* Latency */}
            <span className="text-xs text-txt-3 tabular-nums">
              {(check.processing_time_ms / 1000).toFixed(1)}s
            </span>

            {/* Time */}
            <span className="text-xs text-txt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(check.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return '—'
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return then.toLocaleDateString()
}
