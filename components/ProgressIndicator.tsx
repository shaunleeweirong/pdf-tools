'use client'
import { Progress } from '@/components/ui/progress'

export function ProgressIndicator({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-block size-1.5 animate-pulse bg-brand" aria-hidden />
        {label}
      </p>
      <Progress value={null} className="[&>[data-slot=progress-indicator]]:bg-brand" />
    </div>
  )
}
