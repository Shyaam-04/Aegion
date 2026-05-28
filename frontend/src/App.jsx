import { useState, useEffect, useCallback } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { checkDrugs, getHistory } from './api/aegionApi'
import { useStats } from './hooks/useStats'
import Layout from './components/layout/Layout'
import Navbar from './components/layout/Navbar'
import PrescriptionForm from './components/form/PrescriptionForm'
import StatsPanel from './components/stats/StatsPanel'
import HistoryTable from './components/history/HistoryTable'
import ResultsOverlay from './components/results/ResultsOverlay'
import LoadingOverlay from './components/ui/LoadingOverlay'

const INITIAL_FORM = {
  doctor_id: '',
  medicines: [],
  patient_history: {
    age: '',
    weight: '',
    known_allergies: [],
    current_medications: [],
    conditions: [],
  },
}

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const { stats, refetch: refetchStats } = useStats()

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHistory()
      setHistory(data.checks || [])
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleAnalyze = async () => {
    setError(null)
    setLoading(true)

    try {
      const payload = {
        doctor_id: formData.doctor_id,
        medicines: formData.medicines,
        patient_history: {
          age: parseInt(formData.patient_history.age) || 0,
          weight: parseInt(formData.patient_history.weight) || 0,
          known_allergies: formData.patient_history.known_allergies,
          current_medications: formData.patient_history.current_medications,
          conditions: formData.patient_history.conditions,
        },
      }

      const response = await checkDrugs(payload)
      setResult(response)
      setOverlayOpen(true)

      // Refresh stats and history after new check
      refetchStats()
      fetchHistory()
    } catch (err) {
      setError(err.message || 'Analysis failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <Layout>
        <Navbar stats={stats} />

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/20 text-sm text-risk-high flex items-center justify-between animate-fade-in">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-risk-high/60 hover:text-risk-high text-xs ml-4">
                Dismiss
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel — Form */}
            <PrescriptionForm
              formData={formData}
              setFormData={setFormData}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {/* Right Panel — Stats + History */}
            <div className="flex-1 min-w-0">
              <StatsPanel stats={stats} />
              <HistoryTable 
                history={history} 
                onHistoryClick={(check) => {
                  setResult(check)
                  setOverlayOpen(true)
                }}
              />
            </div>
          </div>
        </main>

        {/* Overlays */}
        {loading && <LoadingOverlay />}
        {overlayOpen && result && (
          <ResultsOverlay result={result} onClose={() => setOverlayOpen(false)} />
        )}
      </Layout>
    </ThemeProvider>
  )
}
