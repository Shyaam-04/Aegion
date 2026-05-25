import { AlertTriangle, ArrowRight } from 'lucide-react'
import RiskBadge from './RiskBadge'

export default function InteractionCard({ interaction, index }) {
  const { drug_a, drug_b, severity, mechanism, clinical_recommendation, source_confidence } = interaction

  const severityClass = `severity-bar-${severity}`
  const confidenceWidth = source_confidence === 'high' ? '100%'
    : source_confidence === 'medium' ? '60%' : '30%'
  const confidenceColor = source_confidence === 'high' ? 'bg-risk-low'
    : source_confidence === 'medium' ? 'bg-risk-medium' : 'bg-risk-high'

  return (
    <div
      className={`card-glass rounded-xl p-5 ${severityClass} animate-stagger-in`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Drug Pair Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-txt-1">
          <span className="bg-surface-2 px-2.5 py-1 rounded-md text-xs font-semibold">{drug_a}</span>
          <ArrowRight className="w-3.5 h-3.5 text-txt-3" />
          <span className="bg-surface-2 px-2.5 py-1 rounded-md text-xs font-semibold">{drug_b}</span>
        </div>
        <RiskBadge level={severity} />
      </div>

      {/* Mechanism */}
      <div className="mb-3">
        <p className="text-xs font-medium text-txt-3 uppercase tracking-wider mb-1">Mechanism</p>
        <p className="text-sm text-txt-2 leading-relaxed">{mechanism}</p>
      </div>

      {/* Clinical Recommendation */}
      <div className="bg-surface-2/50 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-risk-medium flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-txt-2 mb-0.5">Clinical Recommendation</p>
            <p className="text-sm text-txt-1 leading-relaxed">{clinical_recommendation}</p>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-txt-3 font-medium uppercase tracking-wider">Confidence</span>
        <div className="confidence-bar flex-1 max-w-[120px]">
          <div
            className={`confidence-bar-fill ${confidenceColor}`}
            style={{ width: confidenceWidth }}
          />
        </div>
        <span className="text-[11px] text-txt-2 font-medium capitalize">{source_confidence}</span>
      </div>
    </div>
  )
}
