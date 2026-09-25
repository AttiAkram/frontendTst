# Contratto API atteso dal frontend

Ogni funzione in `src/api/client.ts` corrisponde a un endpoint. Tipi in `src/data/types.ts`.

| Funzione | Endpoint suggerito | Note |
|---|---|---|
| `listProducts(query)` | `GET /products?q&category&brands&min&max&rating&fast&deals&trusted&hideSponsored&sort&offset&limit` | Restituisce `{ items, total, nextOffset }` — `nextOffset: null` ferma l'auto-load |
| `getProduct(id)` | `GET /products/:id` | `{ product, reviews, questions, similar }` — `product.priceHistory` (giornaliero) e `ratingHistory` (mensile) alimentano i grafici |
| `suggest(q)` | `GET /search/suggest?q` | Ricerca istantanea |
| — | `POST /products/:id/reviews`, `POST /reviews/:id/comments`, `POST /reviews/:id/helpful` | Oggi solo stato locale |
| `quoteShipping(place, kg, subtotal, member)` | `POST /shipping/quote { cap, items }` | Oggi: distanza haversine dal magazzino più vicino + peso + isole |
| `signIn(provider)` | `GET /auth/:provider` (redirect OAuth) · `POST /auth/passkey` · `POST /auth/magic-link` | Deve restituire `{ id, name, email, provider }` |
| `placeOrder({ method, total })` | `POST /orders` con token del PSP | Restituisce `{ orderId }` |
| — | `POST /alerts { productId, target }` | Avvisi prezzo (oggi in localStorage) |

Il carrello, i preferiti, gli avvisi e le impostazioni sono in `src/store/store.ts` (Zustand + localStorage):
da sincronizzare con `/me/cart`, `/me/wishlist`, `/me/settings` dopo il login.
