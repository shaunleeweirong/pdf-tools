/// <reference lib="webworker" />

// tool cases (e.g. 'merge') are wired in as each tool lands
// NOTE: we do NOT statically import lib/pdf/* tool functions here yet —
// those modules (merge, split, etc.) do not exist until their respective tasks.
// Each tool's case will be added when that task lands, keeping tsc clean.

self.onmessage = async (e: MessageEvent) => {
  const { id, op, payload } = e.data
  try {
    let bytes: Uint8Array
    switch (op) {
      default:
        throw new Error(`Unknown op: ${op}`)
    }
    // eslint-disable-next-line no-unreachable
    ;(self as unknown as Worker).postMessage({ id, ok: true, bytes }, [bytes.buffer])
  } catch (err) {
    ;(self as unknown as Worker).postMessage({ id, ok: false, error: String(err) })
  }
}
