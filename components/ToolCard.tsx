import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import { Card } from '@/components/ui/card'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`}>
      <Card className="h-full p-5 transition hover:shadow-md">
        <h3 className="font-semibold">{tool.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
      </Card>
    </Link>
  )
}
