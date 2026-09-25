const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
export const money = (v: number) => eur.format(v)
export const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v)}%`
export const compact = (v: number) =>
  new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
export const dateShort = (d: Date | number) =>
  new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short' }).format(d)
export const dateLong = (d: Date | number) =>
  new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
export const monthShort = (d: Date | number) =>
  new Intl.DateTimeFormat('it-IT', { month: 'short', year: '2-digit' }).format(d)
