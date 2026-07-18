import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function readFixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(process.cwd(), 'test/fixtures', name)))
}

/** Wrap raw bytes in a File-like object for functions that accept File. */
export function fixtureFile(name: string, type = 'application/pdf'): File {
  const bytes = readFixture(name)
  return new File([bytes], name, { type })
}
