import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const MESSAGES = [
  'Initializing clinical analysis…',
  'Cross-referencing drug database…',
  'Running LLM inference…',
  'Evaluating patient history…',
  'Checking allergy interactions…',
  'Assessing risk severity…',
  'Compiling interaction report…',
]

export default function LoadingOverlay() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [dots, setDots] = useState('')

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1) % MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 overlay-backdrop flex items-center justify-center animate-fade-in">
      <div className="text-center">
        {/* ECG heartbeat line */}
        <div className="ecg-line mx-auto mb-6">
          <svg width="400" height="40" viewBox="0 0 400 40" fill="none">
            <polyline
              points="0,20 30,20 40,20 50,8 55,32 60,4 65,36 70,20 80,20 110,20 140,20 150,20 160,8 165,32 170,4 175,36 180,20 190,20 220,20 250,20 260,20 270,8 275,32 280,4 285,36 290,20 300,20 330,20 360,20 370,20 380,8 385,32 390,4 395,36 400,20"
              stroke="#6366F1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Spinner */}
        <Loader2 className="w-8 h-8 text-accent mx-auto mb-4 animate-spin" />

        {/* Message */}
        <p className="text-sm font-medium text-txt-1 mb-1 transition-all duration-300">
          {MESSAGES[msgIdx]}
        </p>
        <p className="text-xs text-txt-3">
          This may take 5–20 seconds{dots}
        </p>
      </div>
    </div>
  )
}
