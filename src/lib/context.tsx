import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Digest } from './schema'
import { getStorage, isGitHubMode } from './storage'
import { createEmptyDigest, currentPeriod } from './utils'

interface DigestContextType {
  digest: Digest
  setDigest: (d: Digest) => void
  updateDigest: (fn: (d: Digest) => Digest) => void
  period: string
  setPeriod: (p: string) => void
  dirty: boolean
  saving: boolean
  lastSaved: Date | null
  saveToGitHub: () => Promise<void>
  loadPeriod: (p: string) => Promise<void>
  error: string | null
  clearError: () => void
  githubMode: boolean
}

const DigestContext = createContext<DigestContextType | null>(null)

export function DigestProvider({ children }: { children: ReactNode }) {
  const [digest, setDigestRaw] = useState<Digest>(() => createEmptyDigest(currentPeriod()))
  const [period, setPeriodRaw] = useState(currentPeriod())
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const githubMode = isGitHubMode()

  const setDigest = useCallback((d: Digest) => {
    setDigestRaw(d)
    setDirty(true)
    localStorage.setItem(`delivery-digest:draft:${d.meta.period}`, JSON.stringify(d))
  }, [])

  const updateDigest = useCallback((fn: (d: Digest) => Digest) => {
    setDigestRaw(prev => {
      const next = fn(prev)
      setDirty(true)
      localStorage.setItem(`delivery-digest:draft:${next.meta.period}`, JSON.stringify(next))
      return next
    })
  }, [])

  const loadPeriod = useCallback(async (p: string) => {
    try {
      const draft = localStorage.getItem(`delivery-digest:draft:${p}`)
      if (draft) {
        setDigestRaw(JSON.parse(draft))
        setPeriodRaw(p)
        setDirty(true)
        return
      }
      const storage = getStorage()
      const loaded = await storage.load(p)
      if (loaded) {
        setDigestRaw(loaded)
        setDirty(false)
      } else {
        setDigestRaw(createEmptyDigest(p))
        setDirty(false)
      }
      setPeriodRaw(p)
    } catch (e: any) {
      if (e.message === 'TOKEN_INVALID') {
        setError('TOKEN_INVALID')
      } else {
        setError(e.message)
      }
    }
  }, [])

  const saveToGitHub = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const storage = getStorage()
      await storage.save(digest)
      setDirty(false)
      setLastSaved(new Date())
      localStorage.removeItem(`delivery-digest:draft:${digest.meta.period}`)
    } catch (e: any) {
      if (e.message === 'TOKEN_INVALID') {
        setError('TOKEN_INVALID')
      } else if (e.message === 'CONFLICT') {
        setError('CONFLICT')
      } else {
        setError(e.message)
      }
    } finally {
      setSaving(false)
    }
  }, [digest])

  const setPeriod = useCallback((p: string) => {
    setPeriodRaw(p)
    loadPeriod(p)
  }, [loadPeriod])

  const clearError = useCallback(() => setError(null), [])

  useEffect(() => {
    loadPeriod(period)
  }, [])

  return (
    <DigestContext.Provider value={{
      digest, setDigest, updateDigest, period, setPeriod,
      dirty, saving, lastSaved, saveToGitHub, loadPeriod,
      error, clearError, githubMode,
    }}>
      {children}
    </DigestContext.Provider>
  )
}

export function useDigest() {
  const ctx = useContext(DigestContext)
  if (!ctx) throw new Error('useDigest must be used within DigestProvider')
  return ctx
}
