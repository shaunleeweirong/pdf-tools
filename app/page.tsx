import { ToolGrid } from '@/components/ToolGrid'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Every PDF tool you need — free & private</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Merge, split, convert, edit and more. Everything runs in your browser — your files never
          leave your device.
        </p>
      </section>
      <ToolGrid />
    </main>
  )
}
