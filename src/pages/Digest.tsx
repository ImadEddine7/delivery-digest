import { useParams } from 'react-router-dom'
import { useDigest } from '@/lib/context'
import { HeaderStrip } from '@/blocks/HeaderStrip'
import { Revenue } from '@/blocks/Revenue'
import { OffshoreRatio } from '@/blocks/OffshoreRatio'
import { PoCoverage } from '@/blocks/PoCoverage'
import { KeyMessages } from '@/blocks/KeyMessages'
import { Planning } from '@/blocks/Planning'
import { Headcount } from '@/blocks/Headcount'
import { useEffect } from 'react'

export function DigestPage() {
  const { period } = useParams<{ period: string }>()
  const { digest, loadPeriod } = useDigest()

  useEffect(() => {
    if (period) loadPeriod(period)
  }, [period, loadPeriod])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <HeaderStrip digest={digest} />
      <Revenue digest={digest} />
      <OffshoreRatio digest={digest} />
      <PoCoverage digest={digest} />
      <Headcount digest={digest} />
      <KeyMessages digest={digest} />
      <Planning digest={digest} />
    </div>
  )
}
