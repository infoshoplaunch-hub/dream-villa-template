import * as React from 'react'
import { render } from 'react-email'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Ekaterini VIP Villa'
const SENDER_DOMAIN = 'notify.ekaterinivipvila.gr'
const FROM_DOMAIN = 'ekaterinivipvila.gr'
const OWNER_EMAIL = 'info@katerinavipvilla.gr'

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(1000).optional().default(''),
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(7),
  children: z.number().int().min(0).max(7),
  lang: z.enum(['el', 'en']).optional().default('el'),
})

function datesBetween(startISO: string, endExclusiveISO: string): string[] {
  const out: string[] = []
  const d = new Date(startISO + 'T00:00:00Z')
  const end = new Date(endExclusiveISO + 'T00:00:00Z')
  while (d < end) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

async function enqueueTemplate(
  supabase: any,
  opts: {
    templateName: string
    recipientEmail: string
    templateData: Record<string, any>
    idempotencyKey: string
  },
) {
  const entry = TEMPLATES[opts.templateName]
  if (!entry) throw new Error(`Template not found: ${opts.templateName}`)
  const el = React.createElement(entry.component, opts.templateData)
  const html = await render(el)
  const text = await render(el, { plainText: true })
  const subject =
    typeof entry.subject === 'function'
      ? entry.subject(opts.templateData)
      : entry.subject
  const messageId = crypto.randomUUID()

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: opts.recipientEmail,
    status: 'pending',
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: opts.recipientEmail,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: opts.templateName,
      idempotency_key: opts.idempotencyKey,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: opts.recipientEmail,
      status: 'failed',
      error_message: `Failed to enqueue: ${error.message}`,
    })
    console.error('Failed to enqueue email', { error, templateName: opts.templateName })
  }
}

export const Route = createFileRoute('/api/public/booking-request')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid input', details: parsed.error.issues },
            { status: 400 },
          )
        }
        const data = parsed.data

        if (data.check_in >= data.check_out) {
          return Response.json(
            { error: 'check_out must be after check_in' },
            { status: 400 },
          )
        }

        // Season bounds: April 20 – October 20 (both check_in and check_out inclusive)
        const inSeason = (iso: string) => {
          const [, mm, dd] = iso.split('-').map((n) => parseInt(n, 10))
          if (mm < 4 || mm > 10) return false
          if (mm === 4 && dd < 20) return false
          if (mm === 10 && dd > 20) return false
          return true
        }
        if (!inSeason(data.check_in) || !inSeason(data.check_out)) {
          return Response.json(
            { error: 'out_of_season' },
            { status: 400 },
          )
        }

        // Minimum stay: 7 nights
        const nightsCount = Math.round(
          (new Date(data.check_out + 'T00:00:00Z').getTime() -
            new Date(data.check_in + 'T00:00:00Z').getTime()) /
            86400000,
        )
        if (nightsCount < 7) {
          return Response.json(
            { error: 'min_nights', minimum: 7 },
            { status: 400 },
          )
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        // Availability check: any blocked_date or overlapping confirmed booking?
        const requestedNights = datesBetween(data.check_in, data.check_out)

        const { data: blocked, error: blockedErr } = await supabaseAdmin
          .from('blocked_dates')
          .select('date')
          .gte('date', data.check_in)
          .lt('date', data.check_out)
          .limit(1)
        if (blockedErr) {
          console.error('blocked_dates check failed', blockedErr)
          return Response.json({ error: 'Availability check failed' }, { status: 500 })
        }
        if (blocked && blocked.length > 0) {
          return Response.json(
            { error: 'unavailable', reason: 'blocked_dates' },
            { status: 409 },
          )
        }

        // Overlap: existing confirmed booking with check_in < requested.check_out AND check_out > requested.check_in
        const { data: overlaps, error: overlapErr } = await supabaseAdmin
          .from('bookings')
          .select('id')
          .eq('status', 'confirmed')
          .lt('check_in', data.check_out)
          .gt('check_out', data.check_in)
          .limit(1)
        if (overlapErr) {
          console.error('bookings overlap check failed', overlapErr)
          return Response.json({ error: 'Availability check failed' }, { status: 500 })
        }
        if (overlaps && overlaps.length > 0) {
          return Response.json(
            { error: 'unavailable', reason: 'booked' },
            { status: 409 },
          )
        }

        const guestName = `${data.firstName} ${data.lastName}`.trim()

        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('bookings')
          .insert({
            guest_name: guestName,
            email: data.email,
            phone: data.phone,
            check_in: data.check_in,
            check_out: data.check_out,
            adults: data.adults,
            children: data.children,
            message: data.message || null,
            status: 'pending',
          })
          .select('id')
          .single()

        if (insertErr || !inserted) {
          console.error('booking insert failed', insertErr)
          return Response.json({ error: 'Failed to save booking' }, { status: 500 })
        }

        const nights = requestedNights.length
        const commonData = {
          guestName,
          email: data.email,
          phone: data.phone,
          checkIn: data.check_in,
          checkOut: data.check_out,
          nights,
          adults: data.adults,
          children: data.children,
          message: data.message,
        }

        // Owner + guest emails (fail-soft: booking is saved even if email fails)
        try {
          await enqueueTemplate(supabaseAdmin, {
            templateName: 'booking-request-owner',
            recipientEmail: OWNER_EMAIL,
            templateData: { ...commonData, adminUrl: 'https://www.ekaterinivipvila.gr/admin' },
            idempotencyKey: `booking-owner-${inserted.id}`,
          })
        } catch (e) {
          console.error('owner email failed', e)
        }
        try {
          await enqueueTemplate(supabaseAdmin, {
            templateName: 'booking-request-guest',
            recipientEmail: data.email,
            templateData: { ...commonData, lang: data.lang, guestName: data.firstName },
            idempotencyKey: `booking-guest-${inserted.id}`,
          })
        } catch (e) {
          console.error('guest email failed', e)
        }

        return Response.json({ success: true, bookingId: inserted.id })
      },
    },
  },
})
