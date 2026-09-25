import { Apple } from 'lucide-react'

/** Lightweight, generic payment/auth marks for the demo (swap for official SDK buttons in production). */
export const GoogleG = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6C6.6 42.6 14.6 48 24 48z" />
  </svg>
)

export const AppleMark = ({ size = 18 }: { size?: number }) => <Apple size={size} fill="currentColor" strokeWidth={1.2} />

export const MastercardMark = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 26 16" aria-hidden>
    <circle cx="9" cy="8" r="7" fill="#EB001B" />
    <circle cx="17" cy="8" r="7" fill="#F79E1B" />
    <path d="M13 2.3a7 7 0 0 1 0 11.4 7 7 0 0 1 0-11.4z" fill="#FF5F00" />
  </svg>
)

export const VisaMark = () => <span className="mark-visa">VISA</span>
export const PayPalMark = () => (
  <span className="mark-paypal">
    <b>Pay</b>
    <i>Pal</i>
  </span>
)
export const KlarnaMark = () => <span className="mark-klarna">Klarna.</span>
