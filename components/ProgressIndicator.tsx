'use client'
import { Progress } from '@/components/ui/progress'

export function ProgressIndicator({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Progress value={null} />
    </div>
  )
}
