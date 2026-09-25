# Amazon: pagine, impostazioni ed estensioni → cosa fa ecommerce

## Pagine di Amazon e corrispettivo

| Amazon | ecommerce | Stato demo |
|---|---|---|
| Home con caroselli personalizzati | Home a sezioni numerate + feed "Per te" infinito | ✅ |
| Ricerca con suggerimenti | Palette `⌘K` con risultati istantanei e anteprima | ✅ |
| Risultati con filtri laterali (reparto, prezzo, stelle, marca, Prime) | Filtri laterali (desktop) / bottom sheet (mobile), filtri nell'URL condivisibile | ✅ |
| Pagina prodotto (buy box, varianti, bullet, dettagli, recensioni, Q&A, "spesso comprati insieme", "clienti hanno visto anche") | Tutto presente, generato dai dati del prodotto | ✅ |
| Stima consegna "Consegna a Milano 20121" | CAP in header → prezzo e data per ogni velocità | ✅ |
| Carrello + "Salva per dopo" | ✅ + coupon automatici | ✅ |
| Checkout a step + 1-Click | Checkout a 4 step, pagamento express, preferenza "1 click" | ✅ |
| Il mio account (Ordini, Accesso e sicurezza, Prime, Indirizzi, Pagamenti, Buoni regalo, Messaggi, Liste, Cronologia, Iscriviti e risparmia, Dati e privacy, Preferenze comunicazioni) | Hub con le stesse 12 voci | ✅ (alcune solo UI) |
| Liste desideri | Preferiti con variazione prezzo e avvisi | ✅ |
| Prime | Plus (spedizione gratis, express −50%, resi 60 gg) | ✅ toggle |
| Tracciamento ordine | Timeline a punti + stato ordini | ✅ UI |
| Resi, assistenza chat, Vine, Subscribe & Save, Buoni regalo | Voci nell'account | 🟡 da fare con il backend |

## Estensioni browser che la gente installa per Amazon → integrate

| Estensione | Cosa fa | Da noi |
|---|---|---|
| **Keepa**, **CamelCamelCamel** | Storico prezzi, minimi, avvisi | Grafico a gradini 1M/3M/6M/1A, min/media/max, verdetto "compra/aspetta", "Affare" 0–100, avviso prezzo con slider |
| **Fakespot**, **ReviewMeta** | Affidabilità recensioni | Voto A–F su card e pagina, rating corretto, recensioni sospette segnalate/nascoste, check automatici |
| **Honey**, **Capital One Shopping**, **Rakuten** | Coupon al checkout | Coupon trovato in pagina prodotto e applicato in carrello/checkout con animazione di ricerca |
| Filtri uBlock / "Amazon Sponsored Hider" | Nascondono sponsorizzati | Toggle globale + filtro |
| Pricepulse / "fake discount checker" | Scopre sconti gonfiati | "Sconto reale" sulla mediana a 90 giorni vs prezzo barrato |
| "Amazon Unit Price Sorter" | Prezzo per unità | €/W ecc. su card, pagina, ordinamento dedicato |
| Comparatori | Confronto | Vassoio confronto + tabella fino a 4 prodotti |

Tutte attivabili/disattivabili da **Account → Estensioni** (salvate in locale).

## Pagamenti e login previsti

- Login: Google (OAuth/OIDC), Apple (Sign in with Apple), passkey (WebAuthn), magic link email.
- Pagamenti: carte Mastercard/Visa/Amex via PSP con tokenizzazione + 3-D Secure, Apple Pay / Google Pay (Payment Request API o SDK PSP), PayPal, bonifico istantaneo open-banking (PSD2), Klarna.
- Nessun dato di carta tocca i nostri server: il frontend invia al backend solo il token del PSP.
