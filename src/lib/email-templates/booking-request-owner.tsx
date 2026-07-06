import React from 'react'
import {
  Body,
  Button,
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

interface PriceGroup { nights: number; rate: number; subtotal: number }

interface Props {
  guestName?: string
  email?: string
  phone?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  adults?: number
  children?: number
  message?: string
  adminUrl?: string
  priceGroups?: PriceGroup[]
  subtotal?: number
  discount?: number
  promoActive?: boolean
  total?: number
}

const eur = (n: number) => `€${new Intl.NumberFormat('el-GR', { maximumFractionDigits: 0 }).format(n)}`

const Email = ({
  guestName = '—',
  email = '—',
  phone = '—',
  checkIn = '—',
  checkOut = '—',
  nights = 0,
  adults = 0,
  children: kids = 0,
  message,
  adminUrl = 'https://www.ekaterinivipvila.gr/admin',
}: Props) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Νέο αίτημα κράτησης από {guestName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Νέο αίτημα κράτησης</Heading>
        <Text style={lead}>
          Λάβατε ένα νέο αίτημα κράτησης για την Ekaterini VIP Villa.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Στοιχεία επισκέπτη</Heading>
          <Row label="Ονοματεπώνυμο" value={guestName} />
          <Row label="Email" value={email} />
          <Row label="Τηλέφωνο" value={phone} />
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Ημερομηνίες</Heading>
          <Row label="Άφιξη" value={checkIn} />
          <Row label="Αναχώρηση" value={checkOut} />
          <Row label="Διανυκτερεύσεις" value={String(nights)} />
          <Row label="Ενήλικες" value={String(adults)} />
          <Row label="Παιδιά" value={String(kids)} />
        </Section>

        {message ? (
          <Section style={card}>
            <Heading as="h2" style={h2}>Μήνυμα</Heading>
            <Text style={msgText}>{message}</Text>
          </Section>
        ) : null}

        <Section style={{ textAlign: 'center', marginTop: '28px' }}>
          <Button href={adminUrl} style={btn}>Διαχείριση κρατήσεων</Button>
        </Section>

        <Hr style={hr} />
        <Text style={foot}>
          Το αίτημα είναι σε κατάσταση <strong>pending</strong> μέχρι να το επιβεβαιώσετε από το admin panel.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={rowStyle}>
    <span style={rowLabel}>{label}:</span> <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Νέο αίτημα κράτησης — ${d.guestName ?? 'επισκέπτης'}, ${d.checkIn ?? ''} → ${d.checkOut ?? ''}`,
  displayName: 'Booking request — owner notification',
  to: 'info@katerinavipvilla.gr',
  previewData: {
    guestName: 'Γιάννης Παπαδόπουλος',
    email: 'guest@example.com',
    phone: '+30 690 000 0000',
    checkIn: '2026-07-15',
    checkOut: '2026-07-20',
    nights: 5,
    adults: 2,
    children: 1,
    message: 'Θα φτάσουμε αργά το βράδυ.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#1a1a1a' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const h1 = { fontSize: '24px', fontWeight: 600, margin: '0 0 8px', color: '#1a1a1a' }
const h2 = { fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#7a5b3a', margin: '0 0 12px' }
const lead = { fontSize: '15px', color: '#4a4a4a', margin: '0 0 24px' }
const card = { backgroundColor: '#faf7f2', border: '1px solid #ece3d4', borderRadius: '12px', padding: '20px 22px', margin: '0 0 16px' }
const rowStyle = { fontSize: '14px', margin: '6px 0', color: '#2a2a2a' }
const rowLabel = { color: '#6a6a6a', fontWeight: 500 }
const rowValue = { color: '#1a1a1a', fontWeight: 600 }
const msgText = { fontSize: '14px', color: '#2a2a2a', margin: 0, whiteSpace: 'pre-wrap' as const }
const btn = { backgroundColor: '#c47a3d', color: '#ffffff', padding: '12px 28px', borderRadius: '999px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }
const hr = { border: 'none', borderTop: '1px solid #ece3d4', margin: '28px 0 16px' }
const foot = { fontSize: '12px', color: '#7a7a7a', textAlign: 'center' as const, margin: 0 }
