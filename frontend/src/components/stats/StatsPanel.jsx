import { Activity, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Database } from 'lucide-react'
import MetricCard from './MetricCard'

export default function StatsPanel({ stats }) {
  if (!stats) {
    return (
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-txt-1 mb-4">System Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-glass rounded-xl p-4 animate-pulse">
              <div className="h-3 w-16 bg-surface-3 rounded mb-3" />
              <div className="h-7 w-12 bg-surface-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { total_checks, risk_breakdown, safe_to_prescribe, unsafe_to_prescribe, source_breakdown } = stats
  const total = total_checks || 1

  const highPct = ((risk_breakdown.high / total) * 100).toFixed(0)
  const medPct = ((risk_breakdown.medium / total) * 100).toFixed(0)
  const lowPct = ((risk_breakdown.low / total) * 100).toFixed(0)

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-txt-1 mb-4">System Overview</h2>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <MetricCard
          label="Total Checks"
          value={total_checks}
          icon={<Activity className="w-4 h-4" />}
          color="text-accent"
        />
        <MetricCard
          label="High Risk"
          value={risk_breakdown.high}
          icon={<ShieldAlert className="w-4 h-4" />}
          color="text-risk-high"
          subtitle={`${highPct}% of all checks`}
        />
        <MetricCard
          label="Medium Risk"
          value={risk_breakdown.medium}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="text-risk-medium"
          subtitle={`${medPct}% of all checks`}
        />
        <MetricCard
          label="Low Risk"
          value={risk_breakdown.low}
          icon={<ShieldCheck className="w-4 h-4" />}
          color="text-risk-low"
          subtitle={`${lowPct}% of all checks`}
        />
        <MetricCard
          label="Safe"
          value={safe_to_prescribe}
          icon={<ShieldCheck className="w-4 h-4" />}
          subtitle={`${unsafe_to_prescribe} unsafe`}
        />
        <MetricCard
          label="LLM Inferences"
          value={source_breakdown.llm}
          icon={<Cpu className="w-4 h-4" />}
          subtitle={`${source_breakdown.fallback} fallback`}
        />
      </div>

      {/* Risk Distribution Bar */}
      <div className="card-glass rounded-xl p-4">
        <p className="text-[11px] font-medium text-txt-3 uppercase tracking-wider mb-3">Risk Distribution</p>
        <div className="stat-bar">
          {risk_breakdown.high > 0 && (
            <div
              className="stat-bar-segment bg-risk-high"
              style={{ width: `${highPct}%` }}
              title={`High: ${risk_breakdown.high}`}
            />
          )}
          {risk_breakdown.medium > 0 && (
            <div
              className="stat-bar-segment bg-risk-medium"
              style={{ width: `${medPct}%` }}
              title={`Medium: ${risk_breakdown.medium}`}
            />
          )}
          {risk_breakdown.low > 0 && (
            <div
              className="stat-bar-segment bg-risk-low"
              style={{ width: `${lowPct}%` }}
              title={`Low: ${risk_breakdown.low}`}
            />
          )}
        </div>
        <div className="flex items-center gap-4 mt-2.5">
          <Legend color="bg-risk-high" label="High" value={risk_breakdown.high} />
          <Legend color="bg-risk-medium" label="Medium" value={risk_breakdown.medium} />
          <Legend color="bg-risk-low" label="Low" value={risk_breakdown.low} />
        </div>

        {/* Source Bar */}
        <p className="text-[11px] font-medium text-txt-3 uppercase tracking-wider mb-3 mt-5">Inference Source</p>
        <div className="stat-bar">
          {source_breakdown.llm > 0 && (
            <div
              className="stat-bar-segment bg-accent"
              style={{ width: `${((source_breakdown.llm / total) * 100).toFixed(0)}%` }}
            />
          )}
          {source_breakdown.fallback > 0 && (
            <div
              className="stat-bar-segment bg-txt-3"
              style={{ width: `${((source_breakdown.fallback / total) * 100).toFixed(0)}%` }}
            />
          )}
        </div>
        <div className="flex items-center gap-4 mt-2.5">
          <Legend color="bg-accent" label="LLM" value={source_breakdown.llm} />
          <Legend color="bg-txt-3" label="Fallback" value={source_breakdown.fallback} />
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-[11px] text-txt-2 font-medium">{label}</span>
      <span className="text-[11px] text-txt-3 tabular-nums">{value}</span>
    </div>
  )
}
