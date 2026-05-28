import { useEffect } from 'react'
import {
  X, ShieldCheck, ShieldAlert, Shield,
  UserCheck, Clock, Cpu, Database,
  Zap, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react'
import RiskBadge from './RiskBadge'
import InteractionCard from './InteractionCard'
import AllergyCard from './AllergyCard'

export default function ResultsOverlay({ result, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!result) return null

  const {
    interactions = [],
    allergy_alerts = [],
    safe_to_prescribe,
    overall_risk_level,
    requires_doctor_review,
    source,
    cache_hit,
    processing_time_ms
  } = result

  const riskColor = {
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    low: 'text-risk-low',
  }[overall_risk_level] || 'text-risk-low'

  const RiskIcon = overall_risk_level === 'high' ? ShieldAlert
    : overall_risk_level === 'medium' ? Shield : ShieldCheck

  return (
    <div className="fixed inset-0 z-50 overlay-backdrop animate-fade-in">
      <div className="h-full overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              id="close-results"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-surface-1/50 border border-border flex items-center justify-center text-txt-2 hover:text-txt-1 hover:bg-surface-2 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Risk Section */}
          <div className="card-glass rounded-2xl p-6 sm:p-8 mb-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Risk Ring */}
              <div className={`risk-ring ${riskColor} flex-shrink-0`}>
                <RiskIcon className="w-8 h-8" strokeWidth={1.8} />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <RiskBadge level={overall_risk_level} size="lg" />
                  {safe_to_prescribe ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-risk-low bg-risk-low/10 border border-risk-low/20 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Safe to Prescribe
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-risk-high bg-risk-high/10 border border-risk-high/20 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> Unsafe
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-txt-1 mb-1">Interaction Analysis Complete</h2>
                <p className="text-sm text-txt-3">
                  {interactions.length} interaction{interactions.length !== 1 ? 's' : ''} found · {allergy_alerts.length} allergy alert{allergy_alerts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Metadata Strip */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-4 sm:gap-6">
              <MetaItem
                icon={<UserCheck className="w-3.5 h-3.5" />}
                label="Doctor Review"
                value={requires_doctor_review ? 'Required' : 'Not Required'}
                highlight={requires_doctor_review}
              />
              <MetaItem
                icon={source === 'llm' ? <Cpu className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
                label="Source"
                value={source === 'llm' ? 'LLM Analysis' : 'Fallback DB'}
              />
              <MetaItem
                icon={<Zap className="w-3.5 h-3.5" />}
                label="Cache"
                value={cache_hit ? 'Hit' : 'Miss'}
              />
              <MetaItem
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Latency"
                value={`${(processing_time_ms / 1000).toFixed(1)}s`}
              />
            </div>
          </div>

          {/* Interactions */}
          {interactions.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-risk-medium" />
                <h3 className="text-sm font-semibold text-txt-1">Drug Interactions</h3>
                <span className="text-[11px] font-medium text-txt-3 bg-surface-2 px-2 py-0.5 rounded-full">
                  {interactions.length}
                </span>
              </div>
              <div className="space-y-3">
                {interactions.map((interaction, i) => (
                  <InteractionCard key={i} interaction={interaction} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Allergy Alerts */}
          {allergy_alerts.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-risk-high" />
                <h3 className="text-sm font-semibold text-txt-1">Allergy Alerts</h3>
                <span className="text-[11px] font-medium text-txt-3 bg-surface-2 px-2 py-0.5 rounded-full">
                  {allergy_alerts.length}
                </span>
              </div>
              <div className="space-y-3">
                {allergy_alerts.map((alert, i) => (
                  <AllergyCard key={i} alert={alert} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* No Issues OR Missing History Details */}
          {interactions.length === 0 && allergy_alerts.length === 0 && (
            <div className={`card-glass rounded-xl p-8 text-center animate-slide-up ${!safe_to_prescribe ? 'border-risk-high/30 bg-risk-high/5' : ''}`}>
              {!safe_to_prescribe ? (
                <>
                  <AlertTriangle className="w-12 h-12 text-risk-medium mx-auto mb-3 opacity-80" />
                  <h3 className="text-sm font-semibold text-txt-1 mb-1">Details Unavailable</h3>
                  <p className="text-sm text-txt-3">This is an older check from before detailed interactions were recorded in the database. It was flagged as high risk.</p>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-12 h-12 text-risk-low mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-txt-1 mb-1">No Interactions Detected</h3>
                  <p className="text-sm text-txt-3">The prescribed medicines appear safe based on available data.</p>
                </>
              )}
            </div>
          )}

          {/* Bottom close */}
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-sm text-txt-3 hover:text-txt-1 transition-colors"
            >
              Press <kbd className="px-1.5 py-0.5 bg-surface-2 rounded text-[11px] font-mono mx-0.5">Esc</kbd> or click to close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-txt-3">{icon}</span>
      <div>
        <p className="text-[10px] text-txt-3 uppercase tracking-wider font-medium">{label}</p>
        <p className={`text-xs font-semibold ${highlight ? 'text-risk-medium' : 'text-txt-1'}`}>{value}</p>
      </div>
    </div>
  )
}
