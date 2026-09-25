# ecommerce — frontend (demo)

Un'alternativa ad Amazon con un linguaggio editoriale in stile Patagonia / Nike: fotografia a tutta pagina, titoli condensati, tanto spazio bianco. Gli strumenti che di solito installi come estensioni sono già integrati.
React 19 + Vite + TypeScript. Mobile e desktop.

```bash
cd ecommerce
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

- Tela bianca, grigio `#F5F5F5` dietro le foto; il colore acceso è riservato alle azioni e ha **sempre un bordo nero** da 1.5px.
- Tipografia: **Barlow Condensed** 800 maiuscolo per i titoli, **Inter** per il testo (entrambi inclusi nel bundle via `@fontsource`, nessuna dipendenza da Google Fonts).
- Layout: hero a tutta pagina con titolo sovrapposto, tile editoriali 4:5, caroselli orizzontali, blocco "storia" immagine + testo, card prodotto senza bordi (foto 1:1, nome, categoria, prezzo) con seconda foto e "Aggiungi al carrello" al passaggio del mouse.
- **Linee con punto** (`<Rule>`): `●────○` chiude un blocco, la variante `— · — ·` separa i blocchi interni.
- Animazioni: [Motion](https://motion.dev) (parallax dell'hero, reveal, transizioni, gesture), [Lenis](https://lenis.darkroom.engineering) per lo smooth scroll; header che si nasconde scorrendo verso il basso.
- Foto: Unsplash (licenza gratuita), elencate in `src/data/images.ts` e caricate dal browser; se una non carica compare un riquadro neutro con il nome. Il backend manderà le immagini vere nel campo `product.images`.

## Segnali funzionali (linee + punti)

Ogni linea con punto è un indicatore, non una decorazione. Un solo componente, `Track` (`src/components/Signal.tsx`):
linea = totale, parte piena = fatto, **punto = dove sei ora**, **anello finale = obiettivo** (si riempie a completamento), **punto che corre con glow = sta caricando**.

| Dove | Cosa indica |
|---|---|
| Sotto l'header | Linea con glow mentre una chiamata API è in corso |
| Separatori di sezione | Si riempiono mentre leggi il blocco, l'anello si chiude quando l'hai superato |
| Menu in alto, tab prodotto | Il punto segue il mouse / la sezione attiva; sotto le tab, avanzamento di lettura della pagina |
| Caroselli | Posizione nello scroll + "4 / 12"; clic sulla linea per saltare |
| Feed automatico | "36 di 320" visti; glow mentre carica la pagina successiva, anello verde a fine lista |
| Filtri | Un punto per gruppo di filtri attivo + linea = % di catalogo escluso; il tasto "Filtri" su mobile mostra conteggio e linea |
| Prezzo (pagina prodotto) | Punto = prezzo di oggi fra minimo e massimo a 12 mesi, tacca = media, colore = conviene / aspetta |
| Disponibilità | Linea delle scorte, rossa quando sta finendo |
| Consegna | Countdown all'orario limite per la consegna più rapida (la linea si svuota) |
| Carrello | Linea verso la spedizione gratuita (39 €) + anello attorno all'icona del carrello nell'header |
| Coupon | Glow mentre cerca, anello verde quando applica |
| Carta di credito | Un punto per campo valido (numero, intestatario, scadenza, CVC) |
| Preferiti | Anello = prezzo quando l'hai salvato, punto = oggi, tacca = avviso prezzo |
| Account | Completamento del profilo, un punto per passo |
| Toast | Linea che si consuma fino alla chiusura automatica |

I **bottoni** dicono cosa succede o cosa è già successo:
- **Aggiungi al carrello:** quanti ne hai già; glow mentre aggiunge, poi "Aggiunto ✓".
- **Compra ora:** data di arrivo.
- **Preferiti:** variazione di prezzo da quando l'hai salvato.
- **Confronta:** "2/4" con la linea.
- **Mostra altre recensioni:** "6 di 24 lette".
- **Paga:** glow durante l'autorizzazione 3-D Secure.
- **Frecce del carosello:** si disattivano ai bordi.
- **Icona account:** punto verde quando sei connesso.

## Pagine

| Rotta | Contenuto |
|---|---|
| `/` | Hero, categorie, offerte vere, estensioni, feed "Per te" con **auto-load** |
| `/shop` | Filtri (categoria, prezzo, voto, marca, consegna domani, offerte vere, recensioni affidabili, no sponsor), ordinamenti, filtri in URL, auto-load |
| `/p/:id` | Pagina generata dai dati: galleria (trascinabile), buy box, varianti, spedizione per CAP, avviso prezzo, **grafico storico prezzi**, **evoluzione recensioni**, analisi affidabilità, recensioni con filtri + commenti + scrittura, Q&A, "spesso comprati insieme", simili, barra acquisto fissa su mobile |
| `/cart` | Quantità, salva per dopo, ricerca coupon automatica, stima consegna, pagamento express |
| `/checkout` | Indirizzo (CAP → città), spedizione (prezzo/ETA per distanza dal magazzino e peso), pagamento: carta (Luhn, brand Mastercard/Visa, anteprima animata), Apple Pay, Google Pay, PayPal, bonifico open-banking, Klarna 3 rate |
| `/login` | Google, Apple, passkey, magic link email |
| `/account` | Hub stile "Il mio account": ordini con tracking, estensioni on/off, Plus, preferenze, indirizzi, pagamenti, avvisi prezzo, cronologia, sicurezza, privacy |
| `/wishlist` | Variazione di prezzo da quando l'hai salvato, sparkline, avvisi |
| `/compare` | Fino a 4 prodotti, migliore per riga evidenziato |

Scorciatoie: `⌘K` / `Ctrl+K` o `/` apre la ricerca istantanea.

Ricerca sulle funzionalità Amazon e sulle estensioni integrate: [`docs/RICERCA_AMAZON.md`](docs/RICERCA_AMAZON.md).
