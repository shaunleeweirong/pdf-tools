let worker: Worker | null = null
let seq = 0
const pending = new Map<number, (r: { ok: boolean; bytes?: Uint8Array; error?: string }) => void>()

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e) => {
      const { id, ...rest } = e.data
      pending.get(id)?.(rest)
      pending.delete(id)
    }
  }
  return worker
}

export function runInWorker(op: string, payload: unknown): Promise<Uint8Array> {
  const id = ++seq
  return new Promise((resolve, reject) => {
    pending.set(id, (r) => (r.ok && r.bytes ? resolve(r.bytes) : reject(new Error(r.error))))
    getWorker().postMessage({ id, op, payload })
  })
}
