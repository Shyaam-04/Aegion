const BASE_URL = 'http://localhost:8000'

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
