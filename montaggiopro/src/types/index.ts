// ─── Tipi reali dal backend Django ───────────────────────

export type Role          = "squadra" | "negozio"
export type AvailStatus   = "free" | "partial" | "busy"
export type VanSize       = "piccolo" | "medio" | "grande"
export type MessageTarget = "tutti" | "verificati" | "nessuno"

export interface DjangoUser {
  email:                string
  first_name:           string
  last_name:            string
  photo:                string | null
  birthday:             string        // "YYYY-MM-DD"
  sex:                  "Male" | "Female"
  last_login:           string | null
  date_joined:          string
  last_password_update: string | null
}

export interface DjangoPaginated<T> {
  count:    number
  next:     string | null
  previous: string | null
  results:  T[]
}

export interface DjangoBook {
  id:          number
  title:       string
  author:      string
  image:       string | null
  book:        string | null
  notes:       string | null
  publisher:   string
  year:        number
  city:        string
  subsection:  string | null
  category:    string
  legend:      string | null
  created_at:  string
  modified_at: string
}

// ─── Tipi dominio MontaggioPro ────────────────────────────

export interface Equipment {
  van:      VanSize
  vanM3:    number
  scalaMot: boolean
  argano:   boolean
}

export interface Team {
  id:           number
  name:         string
  leader:       string
  char:         string
  colors:       [string, string]
  members:      number
  experience:   number
  rating:       number
  reviews:      number
  jobs:         number
  verified:     boolean
  zones:        string[]
  specs:        string[]
  equipment:    Equipment
  bio:          string
  availability: Record<number, AvailStatus>
  email?:       string
  phone?:       string
}

export interface Post {
  id:             number
  team:           Team
  city:           string
  time:           string
  likes:          number
  comments:       number
  caption:        string
  tags:           string[]
  liked?:         boolean
  saved?:         boolean
  media_url?:     string
}

export interface Job {
  id:          number
  store:       { name: string; char: string; colors: [string, string] }
  type:        string
  city:        string
  province:    string
  date:        string
  budget:      number
  floor:       string
  colli:       number
  scalaMot:    boolean
  argano:      boolean
  description: string
  applied:     boolean
}

export interface Review {
  id:     number
  store:  { name: string; char: string; colors: [string, string] }
  rating: number
  date:   string
  text:   string
  tags:   string[]
}

export interface Conversation {
  id:     number
  name:   string
  char:   string
  colors: [string, string]
  last:   string
  time:   string
  unread: number
}

export interface ChatMessage {
  id:   number
  text: string
  me:   boolean
}

export interface NotifPrefs {
  nuoviLavori:   boolean
  messaggi:      boolean
  recensioni:    boolean
  aggiornamenti: boolean
  newsletter:    boolean
}

export interface PrivacyPrefs {
  profiloPubblico: boolean
  mostraDisp:      boolean
  mostraStats:     boolean
  messaggiDa:      MessageTarget
}

export interface Profile extends Team {
  notifPrefs?:   NotifPrefs
  privacyPrefs?: PrivacyPrefs
}
