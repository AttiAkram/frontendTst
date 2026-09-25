import { motion } from 'motion/react'
import { Bell, Box, CreditCard, Gift, History, LogOut, MapPin, MessageSquare, Puzzle, Repeat, Shield, Sparkles, UserCog } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MastercardMark, PayPalMark, VisaMark } from '../components/Marks'
import { Photo } from '../components/Photo'
import { Btn, Rule, SectionHead, Switch } from '../components/ui'
import { Track } from '../components/Signal'
import { PRODUCT_BY_ID, PRODUCTS } from '../data/catalog'
import { dateShort, money } from '../lib/format'
import { EXTENSION_INFO, type Extensions, useStore } from '../store/store'

/** Mirrors Amazon's "Il mio account" hub, plus the extensions panel. */
const TILES: [string, string, string, ReactNode][] = [
  ['ordini', 'I miei ordini', 'Traccia, restituisci, ricompra', <Box size={20} key="1" />],
  ['sicurezza', 'Accesso e sicurezza', 'Passkey, 2FA, dispositivi', <Shield size={20} key="2" />],
  ['membership', 'Plus', 'Spedizioni gratis e resi estesi', <Sparkles size={20} key="3" />],
  ['indirizzi', 'Indirizzi', 'Casa, ufficio, locker', <MapPin size={20} key="4" />],
  ['pagamenti', 'Pagamenti', 'Carte, wallet, rate', <CreditCard size={20} key="5" />],
  ['estensioni', 'Estensioni', 'Storico prezzi, coupon, recensioni', <Puzzle size={20} key="6" />],
  ['avvisi', 'Avvisi prezzo', 'Notifiche quando scende', <Bell size={20} key="7" />],
  ['cronologia', 'Cronologia', 'Visti di recente', <History size={20} key="8" />],
  ['abbonamenti', 'Iscriviti e risparmia', 'Consegne ricorrenti −10%', <Repeat size={20} key="9" />],
  ['buoni', 'Buoni regalo', 'Saldo e riscatto', <Gift size={20} key="10" />],
  ['messaggi', 'Messaggi', 'Venditori e assistenza', <MessageSquare size={20} key="11" />],
  ['privacy', 'Dati e privacy', 'Scarica o cancella i dati', <UserCog size={20} key="12" />],
]

const ORDERS = [
  { id: 'EC-8KQ2L1', p: PRODUCTS[3], date: Date.now() - 2 * 864e5, status: 'In consegna', step: 3 },
  { id: 'EC-7ZX9A0', p: PRODUCTS[17], date: Date.now() - 12 * 864e5, status: 'Consegnato', step: 4 },
  { id: 'EC-6MB3C7', p: PRODUCTS[42], date: Date.now() - 40 * 864e5, status: 'Reso rimborsato', step: 4 },
]

export function Account() {
  const user = useStore((s) => s.user)
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 400)
  }, [hash])
  if (!user) return null // the map's `auth` guard redirects before this renders

  return (
    <div className="container section account">
      <header className="account__head">
        <motion.span className="account__avatar" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          {user.name[0]}
        </motion.span>
        <div>
          <p className="mono small muted">
            ● connesso con {user.provider} · {user.email}
          </p>
          <h1 className="dot-title">Ciao, {user.name.split(' ')[0]}</h1>
        </div>
        <Btn size="sm" icon={<LogOut size={14} />} onClick={() => useStore.getState().logout()}>
          Esci
        </Btn>
      </header>

      <ProfileCompletion />

      <div className="tiles">
        {TILES.map(([id, t, d, icon], i) => (
          <motion.a key={id} href={`#${id}`} className="tile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <span className="tile__icon">{icon}</span>
            <strong className="small">{t}</strong>
            <span className="mono small muted">{d}</span>
          </motion.a>
        ))}
      </div>

      <Rule index="01" label="ordini" />
      <section id="ordini" className="acc-sec">
        <SectionHead index="01" title="Ordini" />
        <div className="orders">
          {ORDERS.map((o) => (
            <div key={o.id} className="order">
              <Link to={`/p/${o.p.id}`} className="order__art">
                <Photo id={o.p.images[0]} alt={o.p.name} w={300} />
              </Link>
              <div className="order__info">
                <span className="mono small muted">
                  {o.id} · {dateShort(o.date)}
                </span>
                <strong className="small">{o.p.name}</strong>
                <div className="order__track">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <span key={s} className={s <= o.step ? 'on' : ''} />
                  ))}
                </div>
                <span className={`mono small ${o.step === 4 ? 'ok' : ''}`}>● {o.status}</span>
              </div>
              <div className="order__actions">
                <Btn size="sm" tone="cart" onClick={() => useStore.getState().addToCart(o.p.id, o.p.variants[0].id)}>
                  Ricompra
                </Btn>
                <Btn size="sm">{o.step === 4 ? 'Reso' : 'Traccia'}</Btn>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Rule index="02" label="estensioni" variant="dashdot" />
      <Extensions />

      <Rule index="03" label="membership & preferenze" />
      <Preferences />

      <Rule index="04" label="indirizzi & pagamenti" variant="dashdot" />
      <section id="indirizzi" className="acc-sec acc-two">
        <div>
          <SectionHead index="04a" title="Indirizzi" />
          {[
            ['Casa', 'Via Roma 1, 20121 Milano', true],
            ['Ufficio', 'Via Emilia 88, 40121 Bologna', false],
            ['Locker', 'Locker ecommerce — Stazione Centrale', false],
          ].map(([l, a, def]) => (
            <div key={l as string} className="kv">
              <div>
                <strong className="small">{l}</strong> {def && <span className="mono small ok">● predefinito</span>}
                <p className="small muted">{a}</p>
              </div>
              <button className="linkbtn small">Modifica</button>
            </div>
          ))}
          <Btn size="sm" tone="account">
            + Nuovo indirizzo
          </Btn>
        </div>
        <div id="pagamenti">
          <SectionHead index="04b" title="Pagamenti" />
          {[
            [<MastercardMark key="m" />, 'Mastercard •••• 4444', 'scade 09/29'],
            [<VisaMark key="v" />, 'Visa •••• 1881', 'scade 02/28'],
            [<PayPalMark key="p" />, 'PayPal', 'collegato'],
          ].map(([icon, l, d], i) => (
            <div key={i} className="kv">
              <div className="row-8">
                {icon}
                <div>
                  <strong className="small">{l}</strong>
                  <p className="mono small muted">{d}</p>
                </div>
              </div>
              <button className="linkbtn small">Rimuovi</button>
            </div>
          ))}
          <Btn size="sm" tone="account">
            + Metodo di pagamento
          </Btn>
        </div>
      </section>

      <Rule index="05" label="avvisi & cronologia" />
      <AlertsAndHistory />

      <Rule index="06" label="sicurezza & privacy" variant="dashdot" />
      <Security />
      <Rule variant="end" label="fine account" />
    </div>
  )
}

function Extensions() {
  const ext = useStore((s) => s.extensions)
  const setExt = useStore((s) => s.setExt)
  return (
    <section id="estensioni" className="acc-sec">
      <SectionHead index="02" kicker="già installate · 0 permessi extra" title="Estensioni" />
      <div className="extlist">
        {(Object.keys(EXTENSION_INFO) as (keyof Extensions)[]).map((k) => (
          <div key={k} className={`extrow${ext[k] ? ' is-on' : ''}`}>
            <div>
              <strong className="small">{EXTENSION_INFO[k].title}</strong>
              <p className="small muted">{EXTENSION_INFO[k].desc}</p>
              <p className="mono small muted">al posto di: {EXTENSION_INFO[k].replaces}</p>
            </div>
            <Switch checked={ext[k]} onChange={(v) => setExt(k, v)} label={EXTENSION_INFO[k].title} />
          </div>
        ))}
      </div>
    </section>
  )
}

function Preferences() {
  const member = useStore((s) => s.member)
  const setMember = useStore((s) => s.setMember)
  const [prefs, setPrefs] = useState({ email: true, push: true, sms: false, eco: true, oneClick: false, dark: false })
  const rows: [keyof typeof prefs, string, string][] = [
    ['oneClick', 'Acquisto in 1 click', 'Usa indirizzo e pagamento predefiniti'],
    ['eco', 'Consegne raggruppate', 'Un solo pacco a settimana, meno CO₂'],
    ['email', 'Email', 'Conferme ordine e avvisi prezzo'],
    ['push', 'Notifiche push', 'Stato spedizione in tempo reale'],
    ['sms', 'SMS corriere', 'Finestra oraria di consegna'],
  ]
  return (
    <section id="membership" className="acc-sec acc-two">
      <div className={`member${member ? ' is-on' : ''}`}>
        <p className="mono up small">Plus</p>
        <p className="dot-title member__price">4,99 €/mese</p>
        <ul className="small">
          <li>● Spedizione standard sempre gratis</li>
          <li>● Express a metà prezzo</li>
          <li>● Resi a 60 giorni</li>
          <li>● Accesso anticipato alle offerte</li>
        </ul>
        <Btn tone={member ? 'ghost' : 'account'} onClick={() => setMember(!member)}>
          {member ? 'Annulla iscrizione' : 'Prova 30 giorni gratis'}
        </Btn>
      </div>
      <div>
        <SectionHead index="03" title="Preferenze" />
        {rows.map(([k, l, d]) => (
          <div key={k} className="kv">
            <div>
              <strong className="small">{l}</strong>
              <p className="small muted">{d}</p>
            </div>
            <Switch checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={l} />
          </div>
        ))}
        <div className="kv">
          <div>
            <strong className="small">Lingua e valuta</strong>
            <p className="small muted">Italiano · EUR €</p>
          </div>
          <button className="linkbtn small">Cambia</button>
        </div>
      </div>
    </section>
  )
}

function AlertsAndHistory() {
  const alerts = useStore((s) => s.alerts)
  const recent = useStore((s) => s.recent)
  const setAlert = useStore((s) => s.setAlert)
  return (
    <section id="avvisi" className="acc-sec acc-two">
      <div>
        <SectionHead index="05a" title="Avvisi prezzo" />
        {alerts.length === 0 && <p className="small muted">Nessun avviso. Attivalo dalla pagina di un prodotto.</p>}
        {alerts.map((a) => {
          const p = PRODUCT_BY_ID.get(a.id)!
          const hit = p.price <= a.target
          return (
            <div key={a.id} className="kv">
              <div>
                <Link to={`/p/${p.id}`} className="small strong">
                  {p.name}
                </Link>
                <p className="mono small muted">
                  obiettivo {money(a.target)} · ora {money(p.price)} {hit && <span className="ok">● raggiunto</span>}
                </p>
              </div>
              <button className="linkbtn small" onClick={() => setAlert(a.id, null)}>
                Elimina
              </button>
            </div>
          )
        })}
      </div>
      <div id="cronologia">
        <SectionHead index="05b" title="Visti di recente" />
        <div className="recent">
          {recent.length === 0 && <p className="small muted">Ancora niente.</p>}
          {recent.map((id) => {
            const p = PRODUCT_BY_ID.get(id)!
            return (
              <Link key={id} to={`/p/${id}`} className="recent__i" title={p.name}>
                <Photo id={p.images[0]} alt={p.name} w={300} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Security() {
  const [s, set] = useState({ twofa: true, passkey: true, alerts: true })
  return (
    <section id="sicurezza" className="acc-sec acc-two">
      <div>
        <SectionHead index="06a" title="Sicurezza" />
        {(
          [
            ['passkey', 'Passkey', 'Face ID / impronta al posto della password'],
            ['twofa', 'Verifica in due passaggi', 'App authenticator'],
            ['alerts', 'Avvisi di accesso', 'Email a ogni nuovo dispositivo'],
          ] as const
        ).map(([k, l, d]) => (
          <div key={k} className="kv">
            <div>
              <strong className="small">{l}</strong>
              <p className="small muted">{d}</p>
            </div>
            <Switch checked={s[k]} onChange={(v) => set({ ...s, [k]: v })} label={l} />
          </div>
        ))}
      </div>
      <div id="privacy">
        <SectionHead index="06b" title="Dati e privacy" />
        <div className="kv">
          <div>
            <strong className="small">Scarica i tuoi dati</strong>
            <p className="small muted">Ordini, recensioni e cronologia in JSON (GDPR art. 20)</p>
          </div>
          <button className="linkbtn small">Richiedi</button>
        </div>
        <div className="kv">
          <div>
            <strong className="small">Pubblicità personalizzata</strong>
            <p className="small muted">Disattivata di default</p>
          </div>
          <Switch checked={false} onChange={() => {}} label="Pubblicità personalizzata" />
        </div>
        <div className="kv">
          <div>
            <strong className="small bad">Elimina account</strong>
            <p className="small muted">Irreversibile dopo 30 giorni</p>
          </div>
          <button className="linkbtn small bad">Elimina</button>
        </div>
      </div>
    </section>
  )
}

/** Account setup as a dot-line: each dot is a step, the line is how complete the profile is. */
function ProfileCompletion() {
  const alerts = useStore((s) => s.alerts.length)
  const member = useStore((s) => s.member)
  const steps: [string, boolean][] = [
    ['Accesso', true],
    ['Indirizzo', true],
    ['Pagamento', true],
    ['Passkey', true],
    ['Avviso prezzo', alerts > 0],
    ['Plus', member],
  ]
  const done = steps.filter(([, v]) => v).length
  const next = steps.find(([, v]) => !v)
  return (
    <div className="profilesig">
      <Track
        tone="account"
        value={done / steps.length}
        marks={steps.map(([l, v], i) => ({ at: (i + 1) / (steps.length + 1), label: l, done: v }))}
        label={done === steps.length ? 'Profilo completo' : `Profilo al ${Math.round((done / steps.length) * 100)}% · prossimo: ${next?.[0]}`}
        aside={`${done}/${steps.length}`}
      />
    </div>
  )
}
