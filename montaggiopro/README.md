# MontaggioPro — Frontend

Social/marketplace per il settore montaggio arredamento.
Mette in contatto **negozi** e **squadre di montatori** in Italia.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Lucide React** — icone (zero emoji)
- Font system Apple (`-apple-system, BlinkMacSystemFont`)
- Zero CSS framework — tutto inline style con design token
- Zero Redux — React Context

## Struttura

```
src/
  config/api.ts        → endpoint backend (reali + placeholder)
  types/index.ts       → interfacce TypeScript
  tokens.ts            → design tokens (colori, font, palette)
  context/             → RoleCtx, ProfileCtx, AuthCtx
  hooks/               → useBreakpoint, useQuery, useMutation
  data/mock.ts         → dati demo (sostituire con API)
  components/          → primitivi riusabili (Avatar, Btn, Input…)
  features/            → componenti dominio (PostCard, JobCard…)
  pages/CalendarPage   → calendario disponibilità stile Apple
  App.tsx              → routing, layout, pagine
```

## Avvio rapido

```bash
# Installa dipendenze
npm install

# Avvia frontend in sviluppo
npm run dev          # → http://localhost:3000

# Avvia tutto (frontend + backend Docker)
npm run dev:all
```

## Configurazione

Copia `.env.example` in `.env.local` e imposta:

```
VITE_API_BASE=http://api.localhost
```

## Backend (Django + DRF)

Il backend è in `/backend`. Richiede Docker:

```bash
npm run backend:up       # avvia Docker Compose
npm run backend:migrate  # esegue le migrazioni
npm run backend:logs     # vedi i log
npm run backend:down     # ferma i container
```

Aggiungi in `/etc/hosts` se `api.localhost` non risolve:
```
127.0.0.1  api.localhost
```

## Autenticazione

Il backend usa **JWT Bearer token** + **Session cookie** + **CSRF token**.  
Tutte le richieste `POST/PUT/DELETE` devono includere `X-CSRFToken` nell'header.  
`useQuery` e `useMutation` gestiscono questo automaticamente.

## Stato API

| Feature     | Stato         |
|-------------|---------------|
| Auth        | ✅ Implementato (Django) |
| Teams       | 🔄 Modello creato, view da fare |
| Jobs        | 🔄 Modello creato, view da fare |
| Feed/Posts  | 🔄 Modello creato, view da fare |
| Reviews     | 🔄 Modello creato, view da fare |
| Messages    | 🔄 Modello creato, view da fare |
| Calendar    | ✅ UI completa (dati mock) |

## Design

- Palette: `#FAFAFA` bg · `#FFFFFF` card · `#DBDBDB` border · `#262626` text · `#0095F6` accent
- Mobile-first, 3 breakpoint: mobile (<600) · tablet (600-1023) · desktop (≥1024)
- Calendario stile Apple Calendar con pallini disponibilità, bottom sheet mobile, panel fisso desktop
