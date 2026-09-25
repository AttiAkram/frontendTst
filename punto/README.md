# PUNTO. — frontend e-commerce (demo)

Un'alternativa ad Amazon: minimal, bianca, "futuristica", con gli strumenti che di solito installi come estensioni già integrati.
React 19 + Vite + TypeScript. Mobile e desktop.

```bash
cd punto
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build statico in dist/
```

Tutti i dati sono mock deterministici (320 prodotti generati) dietro a `src/api/client.ts`:
il backend sostituisce il corpo delle funzioni con delle `fetch()` — vedi [`docs/API.md`](docs/API.md).

## Linguaggio visivo

| Segnale | Colore | Uso |
|---|---|---|
| Giallo + nero | `#FFD400` | Aggiungi al carrello (bottoni, badge, FAB `+`) |
| Blu | `#1F4BFF` | Compra ora / paga |
| Rosso | `#FF2B2B` | Preferiti |
| Verde | `#16C35A` | Account, impostazioni, stati "ok" |

- Bianco/grigi dominanti; ogni colore acceso ha **sempre un bordo nero** da 1.5px.
- **Linee con punto** (`<Rule>`): `●──────○` chiude una sezione, la variante `— · — ·` separa i blocchi interni, `end` segna la fine pagina/lista.
- Font: **Doto** (dot-matrix, titoli), Inter Tight (testo), JetBrains Mono (etichette/dati).
- Animazioni: [Motion](https://motion.dev) (ex Framer Motion) per transizioni, layout e gesture; [Lenis](https://lenis.darkroom.engineering) per lo smooth scroll; Recharts per i grafici.
- Illustrazioni prodotto vettoriali (`ProductArt`) al posto di foto stock: il backend manderà le immagini vere.

## Pagine

| Rotta | Contenuto |
|---|---|
| `/` | Hero, categorie, offerte vere, estensioni, feed "Per te" con **auto-load** |
| `/shop` | Filtri (categoria, prezzo, voto, marca, consegna domani, offerte vere, recensioni affidabili, no sponsor), ordinamenti, filtri in URL, auto-load |
| `/p/:id` | Pagina generata dai dati: galleria (trascinabile), buy box, varianti, spedizione per CAP, avviso prezzo, **grafico storico prezzi**, **evoluzione recensioni**, analisi affidabilità, recensioni con filtri + commenti + scrittura, Q&A, "spesso comprati insieme", simili, barra acquisto fissa su mobile |
| `/cart` | Quantità, salva per dopo, ricerca coupon automatica, stima consegna, pagamento express |
| `/checkout` | Indirizzo (CAP → città), spedizione (prezzo/ETA per distanza dal magazzino e peso), pagamento: carta (Luhn, brand Mastercard/Visa, anteprima animata), Apple Pay, Google Pay, PayPal, bonifico open-banking, Klarna 3 rate |
| `/login` | Google, Apple, passkey, magic link email |
| `/account` | Hub stile "Il mio account": ordini con tracking, estensioni on/off, PUNTO+, preferenze, indirizzi, pagamenti, avvisi prezzo, cronologia, sicurezza, privacy |
| `/wishlist` | Variazione di prezzo da quando l'hai salvato, sparkline, avvisi |
| `/compare` | Fino a 4 prodotti, migliore per riga evidenziato |

Scorciatoie: `⌘K` / `Ctrl+K` o `/` apre la ricerca istantanea.

Ricerca sulle funzionalità Amazon e sulle estensioni integrate: [`docs/RICERCA_AMAZON.md`](docs/RICERCA_AMAZON.md).
