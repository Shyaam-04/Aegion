import { Shield, Sun, Moon, Activity, AlertTriangle, Cpu, Database } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useState, useEffect } from 'react'
import { checkHealth } from '../../api/aegionApi'

export default function Navbar({ stats }) {
  const { theme, toggleTheme } = useTheme()
  const [online, setOnline] = useState(null)

  useEffect(() => {
    checkHealth().then(setOnline)
    const interval = setInterval(() => checkHealth().then(setOnline), 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-surface-1/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left — Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-accent" strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-tight text-txt-1">Aegion</span>
            <span className="hidden sm:inline text-[11px] font-medium text-txt-3 bg-surface-2 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Clinical AI
            </span>
          </div>
        </div>

        {/* Center — Live Operational Stats */}
        <div className="hidden md:flex items-center gap-6">
          {stats && (
            <>
              <NavStat
                icon={<Activity className="w-3.5 h-3.5" />}
                label="Total Checks"
                value={stats.total_checks}
              />
              <div className="w-px h-5 bg-border" />
              <NavStat
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
                label="High Risk"
                value={stats.risk_breakdown?.high || 0}
                color="text-risk-high"
              />
              <div className="w-px h-5 bg-border" />
              <NavStat
                icon={<Cpu className="w-3.5 h-3.5" />}
                label="LLM"
                value={stats.source_breakdown?.llm || 0}
              />
              <NavStat
                icon={<Database className="w-3.5 h-3.5" />}
                label="Fallback"
                value={stats.source_breakdown?.fallback || 0}
              />
            </>
          )}
        </div>

        {/* Right — Status + Theme */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="flex items-center gap-2 text-xs text-txt-3">
            <div className={`w-2 h-2 rounded-full ${
              online === null ? 'bg-txt-3' :
              online ? 'bg-risk-low pulse-dot pulse-dot-low' : 'bg-risk-high'
            }`} />
            <span className="hidden sm:inline">
              {online === null ? 'Checking…' : online ? 'System Online' : 'Offline'}
            </span>
          </div>

          <div className="w-px h-5 bg-border" />

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-txt-2 hover:text-txt-1 hover:bg-surface-2 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavStat({ icon, label, value, color = 'text-txt-2' }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`${color}`}>{icon}</span>
      <span className="text-[11px] text-txt-3 font-medium">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${color === 'text-txt-2' ? 'text-txt-1' : color}`}>
        {value}
      </span>
    </div>
  )
}
