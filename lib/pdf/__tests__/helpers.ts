import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function readFixture(name: string): Uint8Array<ArrayBuffer> {
  const buf = readFileSync(join(process.cwd(), 'test/fixtures', name))
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength) as Uint8Array<ArrayBuffer>
}

/** Wrap raw bytes in a File-like object for functions that accept File. */
export function fixtureFile(name: string, type = 'application/pdf'): File {
  const bytes = readFixture(name)
  return new File([bytes], name, { type })
}
