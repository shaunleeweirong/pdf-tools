'use client'
import { useActionState } from 'react'
import { login } from './action'

export default function StudioLoginPage() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Content Studio</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the studio password.</p>
      <form action={action} className="mt-6 space-y-3">
        <input
          type="password"
          name="password"
          autoFocus
          className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand px-3 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60"
        >
          {pending ? 'Checking…' : 'Enter'}
        </button>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      </form>
    </main>
  )
}
