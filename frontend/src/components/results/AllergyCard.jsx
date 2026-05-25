import { ShieldAlert } from 'lucide-react'
import RiskBadge from './RiskBadge'

export default function AllergyCard({ alert, index }) {
  const { medicine, reason, severity } = alert

  return (
    <div
      className={`card-glass rounded-xl p-4 severity-bar-${severity} animate-stagger-in`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-risk-high/10 flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-4.5 h-4.5 text-risk-high" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-txt-1">{medicine}</h4>
            <RiskBadge level={severity} />
          </div>
          <p className="text-sm text-txt-2 leading-relaxed">{reason}</p>
        </div>
      </div>
    </div>
  )
}
