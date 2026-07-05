import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  lang?: 'el' | 'en'
  guestName?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  adults?: number
  children?: number
}

const copy = {
  el: {
    preview: 'Λάβαμε το αίτημα κράτησής σας',
    hi: (n: string) => `Γεια σας ${n},`,
    thanks:
      'Ευχαριστούμε για το αίτημα κράτησής σας στην Ekaterini VIP Villa. Το λάβαμε και θα επικοινωνήσουμε σύντομα μαζί σας μέσω email ή τηλεφώνου για την επιβεβαίωση διαθεσιμότητας και τιμής.',
    important:
      'Σημείωση: Αυτό είναι ένα αίτημα κράτησης, όχι επιβεβαιωμένη κράτηση. Η κράτηση οριστικοποιείται μόνο μετά την επιβεβαίωσή μας.',
    summary: 'Σύνοψη αιτήματος',
    arrival: 'Άφιξη',
    departure: 'Αναχώρηση',
    nights: 'Διανυκτερεύσεις',
    adults: 'Ενήλικες',
    children: 'Παιδιά',
    contact: 'Για οτιδήποτε χρειάζεστε: info@katerinavipvilla.gr',
    signoff: 'Με εκτίμηση,\nEkaterini VIP Villa',
    heading: 'Λάβαμε το αίτημά σας',
  },
  en: {
    preview: 'We received your booking request',
    hi: (n: string) => `Hi ${n},`,
    thanks:
      'Thank you for your booking request at Ekaterini VIP Villa. We received it and will contact you shortly by email or phone to confirm availability and pricing.',
    important:
      'Please note: this is a booking request, not a confirmed booking. Your booking is confirmed only after our reply.',
    summary: 'Request summary',
    arrival: 'Check-in',
    departure: 'Check-out',
    nights: 'Nights',
    adults: 'Adults',
    children: 'Children',
    contact: 'For anything you need: info@katerinavipvilla.gr',
    signoff: 'Warm regards,\nEkaterini VIP Villa',
    heading: 'We received your request',
  },
} as const

const Email = ({
  lang = 'el',
  guestName = '',
  checkIn = '—',
  checkOut = '—',
  nights = 0,
  adults = 0,
  children: kids = 0,
}: Props) => {
  const t = copy[lang]
  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>Ekaterini <span style={{ color: '#c47a3d', fontStyle: 'italic' }}>VIP</span> Villa</Heading>
          <Heading as="h2" style={h1}>{t.heading}</Heading>
          <Text style={lead}>{t.hi(guestName || (lang === 'el' ? 'επισκέπτη' : 'guest'))}</Text>
          <Text style={p}>{t.thanks}</Text>

          <Section style={notice}>
            <Text style={noticeText}>{t.important}</Text>
          </Section>

          <Section style={card}>
            <Heading as="h3" style={h3}>{t.summary}</Heading>
            <Row label={t.arrival} value={checkIn} />
            <Row label={t.departure} value={checkOut} />
            <Row label={t.nights} value={String(nights)} />
            <Row label={t.adults} value={String(adults)} />
            <Row label={t.children} value={String(kids)} />
          </Section>

          <Text style={p}>{t.contact}</Text>
          <Hr style={hr} />
          <Text style={sign}>{t.signoff}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={rowStyle}>
    <span style={rowLabel}>{label}:</span> <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    d.lang === 'en'
      ? 'We received your booking request — Ekaterini VIP Villa'
      : 'Λάβαμε το αίτημα κράτησής σας — Ekaterini VIP Villa',
  displayName: 'Booking request — guest confirmation',
  previewData: {
    lang: 'el',
    guestName: 'Γιάννης',
    checkIn: '2026-07-15',
    checkOut: '2026-07-20',
    nights: 5,
    adults: 2,
    children: 1,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#1a1a1a' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = { fontSize: '20px', fontWeight: 500, textAlign: 'center' as const, margin: '0 0 24px', color: '#1a1a1a', fontFamily: 'Georgia, "Times New Roman", serif' }
const h1 = { fontSize: '24px', fontWeight: 600, margin: '0 0 16px', color: '#1a1a1a' }
const h3 = { fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#7a5b3a', margin: '0 0 12px' }
const lead = { fontSize: '15px', color: '#1a1a1a', margin: '0 0 12px' }
const p = { fontSize: '15px', lineHeight: 1.6, color: '#3a3a3a', margin: '0 0 16px' }
const notice = { backgroundColor: '#faf1e6', border: '1px solid #f0d9b8', borderRadius: '12px', padding: '14px 18px', margin: '0 0 20px' }
const noticeText = { fontSize: '13px', color: '#7a5b3a', margin: 0, lineHeight: 1.5 }
const card = { backgroundColor: '#faf7f2', border: '1px solid #ece3d4', borderRadius: '12px', padding: '20px 22px', margin: '0 0 20px' }
const rowStyle = { fontSize: '14px', margin: '6px 0', color: '#2a2a2a' }
const rowLabel = { color: '#6a6a6a', fontWeight: 500 }
const rowValue = { color: '#1a1a1a', fontWeight: 600 }
const hr = { border: 'none', borderTop: '1px solid #ece3d4', margin: '24px 0 16px' }
const sign = { fontSize: '13px', color: '#6a6a6a', margin: 0, whiteSpace: 'pre-line' as const }
