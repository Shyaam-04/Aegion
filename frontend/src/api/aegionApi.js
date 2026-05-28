const BASE_URL = typeof window !== 'undefined' && window.location.origin === 'http://localhost:5173'
  ? 'http://localhost:8000'
  : (typeof window !== 'undefined' ? window.location.origin : '');

export async function checkDrugs(payload) {
  const res = await fetch(`${BASE_URL}/check-drugs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    const data = await res.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}
