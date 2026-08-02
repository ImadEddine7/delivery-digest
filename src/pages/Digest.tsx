import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DigestSchema, type Digest as DigestType } from '@/lib/schema'
import { HeaderStrip } from '@/blocks/HeaderStrip'
import { Revenue } from '@/blocks/Revenue'
import { OffshoreRatio } from '@/blocks/OffshoreRatio'
import { PoCoverage } from '@/blocks/PoCoverage'
import { KeyMessages } from '@/blocks/KeyMessages'
import { Planning } from '@/blocks/Planning'
import { getStorage } from '@/lib/storage'

import sampleData from '../../data/digests/2026-07.json'

export function DigestPage() {
  const { period } = useParams<{ period: string }>()
  const [digest, setDigest] = useState<DigestType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const targetPeriod = period || '2026-07'
        const storage = getStorage()
        const loaded = await storage.load(targetPeriod)
        if (loaded) {
          setDigest(loaded)
        } else {
          setDigest(DigestSchema.parse(sampleData))
        }
      } catch (e: any) {
        try {
          setDigest(DigestSchema.parse(sampleData))
        } catch {
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (error || !digest) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-6 text-center">
          <p className="font-medium text-danger">Erreur de chargement</p>
          <p className="mt-1 text-sm text-slate">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <HeaderStrip digest={digest} />
      <Revenue digest={digest} />
      <OffshoreRatio digest={digest} />
      <PoCoverage digest={digest} />
      <KeyMessages digest={digest} />
      <Planning digest={digest} />
    </div>
  )
}
