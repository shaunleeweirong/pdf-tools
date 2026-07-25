'use server'
import { revalidatePath } from 'next/cache'
import { hasValidStudioSession } from './session'
import { approveDraft, rejectDraft, requestChanges } from '@/lib/studio/github'

const SLUG_RE = /^[a-z0-9-]{1,80}$/

async function guard(formData: FormData): Promise<string> {
  if (!(await hasValidStudioSession())) throw new Error('Unauthorized')
  const slug = String(formData.get('slug') ?? '')
  if (!SLUG_RE.test(slug)) throw new Error('Invalid slug')
  return slug
}

export async function approveAction(formData: FormData) {
  const slug = await guard(formData)
  await approveDraft(slug)
  revalidatePath('/studio')
}

export async function rejectAction(formData: FormData) {
  const slug = await guard(formData)
  await rejectDraft(slug)
  revalidatePath('/studio')
}

export async function requestChangesAction(formData: FormData) {
  const slug = await guard(formData)
  const feedback = String(formData.get('feedback') ?? '').trim()
  if (!feedback) throw new Error('Feedback is required')
  await requestChanges(slug, feedback)
  revalidatePath('/studio')
}
