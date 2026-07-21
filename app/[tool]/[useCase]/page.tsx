import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { USE_CASES, getUseCase } from '@/content/use-cases'
import { buildUseCaseJsonLd } from '@/lib/seo'
import { UseCaseTool } from '@/components/UseCaseTool'
import { UseCaseContent } from '@/components/UseCaseContent'

export const dynamicParams = false

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ tool: u.tool, useCase: u.useCase }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string; useCase: string }>
}): Promise<Metadata> {
  const { tool, useCase } = await params
  const uc = getUseCase(tool, useCase)
  if (!uc) return {}
  const path = `/${tool}/${useCase}`
  return {
    title: uc.title,
    description: uc.description,
    keywords: uc.keywords,
    alternates: { canonical: path },
    openGraph: { title: uc.title, description: uc.description, url: path, type: 'website' },
  }
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ tool: string; useCase: string }>
}) {
  const { tool, useCase } = await params
  const uc = getUseCase(tool, useCase)
  if (!uc) notFound()
  const jsonLd = buildUseCaseJsonLd(uc)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {jsonLd.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <h1 className="text-4xl font-semibold tracking-tight">{uc.h1}</h1>
      <p className="mt-3 text-muted-foreground">{uc.description}</p>
      <p className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-block size-1.5 bg-brand" aria-hidden />
        Free · no sign-up · in your browser
      </p>

      <UseCaseTool slug={uc.tool} />

      <UseCaseContent uc={uc} />
    </main>
  )
}
