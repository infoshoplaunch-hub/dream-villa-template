import type { ComponentType } from 'react'
import { template as bookingRequestOwner } from './booking-request-owner'
import { template as bookingRequestGuest } from './booking-request-guest'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-request-owner': bookingRequestOwner,
  'booking-request-guest': bookingRequestGuest,
}
