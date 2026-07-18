import { describe, it, expect } from 'vitest'
import { PDFDocument, degrees } from 'pdf-lib'
import { rotate } from '@/lib/pdf/rotate'
import { readFixture } from './helpers'

describe('rotate', () => {
  it('adds 90° to every page', async () => {
    const out = await rotate(readFixture('multi-5p.pdf'), 90)
    const doc = await PDFDocument.load(out)
    expect(doc.getPage(0).getRotation().angle).toBe(90)
  })
})
