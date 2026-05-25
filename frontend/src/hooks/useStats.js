import { useState, useEffect, useCallback } from 'react'
import { getStats } from '../api/aegionApi'

export function useStats(intervalMs = 30000) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, intervalMs)
    return () => clearInterval(interval)
  }, [fetchStats, intervalMs])

  return { stats, loading, refetch: fetchStats }
}
