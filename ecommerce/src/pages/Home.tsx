import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type ReactNode, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { InfiniteGrid } from '../components/InfiniteGrid'
import { Photo } from '../components/Photo'
import { ProductCard } from '../components/ProductCard'
import { Btn, Reveal, Rule } from '../components/ui'
import { CATEGORIES, PRODUCTS, dealScore, realDiscount } from '../data/catalog'
import { CATEGORY_PHOTOS, EDITORIAL } from '../data/images'
import { EXTENSION_INFO, useStore } from '../store/store'

export function Home() {
  const hideSponsored = useStore((s) => s.extensions.hideSponsored)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])

  const trending = useMemo(() => [...PRODUCTS].sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating).slice(0, 12), [])
  const deals = useMemo(
    () =>
      [...PRODUCTS]
        .filter((p) => realDiscount(p) > 8)
        .sort((a, b) => dealScore(b) - dealScore(a))
        .slice(0, 12),
    [],
  )

  return (
    <>
      {/* ---------- Hero: full-bleed photo, big condensed headline ---------- */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero__media" style={{ y: imgY, scale: imgScale }}>
          <Photo id={EDITORIAL.hero} alt="Persona con cuffie in studio" w={1800} priority label="" />
        </motion.div>
        <div className="hero__shade" />
        <div className="container hero__content">
          <motion.p className="eyebrow eyebrow--light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Collezione autunno 2026
          </motion.p>
          <h1 className="hero__title">
            {['Senti', 'tutto.'].map((w, i) => (
              <motion.span key={w} initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero__lede" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            Audio, wearable e tecnologia per ogni giorno. Prezzi con storico reale, recensioni verificate, consegna domani.
          </motion.p>
          <motion.div className="hero__cta" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
            <Btn to="/shop?category=audio" tone="light" size="lg">
              Acquista audio
            </Btn>
            <Btn to="/shop" tone="outline-light" size="lg">
              Tutto il negozio
            </Btn>
          </motion.div>
        </div>
      </section>

      {/* ---------- Featured: two big editorial tiles ---------- */}
      <section className="container section">
        <SectionTitle eyebrow="In evidenza" title="Scelti per la stagione" />
        <div className="feature">
          <FeatureTile to="/shop?category=wearable" photo={CATEGORY_PHOTOS.wearable[0]} kicker="Wearable" title="Il tempo, misurato bene." cta="Scopri gli smartwatch" />
          <FeatureTile to="/shop?category=camera" photo={CATEGORY_PHOTOS.camera[0]} kicker="Camera" title="Ogni scatto conta." cta="Scopri le camere" />
        </div>
      </section>

      {/* ---------- Trending carousel ---------- */}
      <section className="section section--tight">
        <Carousel eyebrow="Di tendenza" title="I più amati" to="/shop?sort=rating">
          {trending.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </Carousel>
      </section>

      {/* ---------- Editorial split (Patagonia-style storytelling) ---------- */}
      <section className="container section">
        <div className="story">
          <Reveal className="story__media">
            <Photo id={EDITORIAL.desk} alt="Scrivania con laptop" w={1200} />
          </Reveal>
          <div className="story__copy">
            <p className="eyebrow">Il nostro metodo</p>
            <h2 className="display">Prezzi onesti. Sempre.</h2>
            <p>
              Ogni prodotto mostra un anno di storico prezzi e lo sconto calcolato sulla mediana degli ultimi 90 giorni, non su un prezzo di listino gonfiato. Le recensioni
              sospette le segnaliamo noi.
            </p>
            <div className="story__stats">
              <div>
                <strong>365</strong>
                <span>giorni di storico</span>
              </div>
              <div>
                <strong>A–F</strong>
                <span>voto recensioni</span>
              </div>
              <div>
                <strong>0</strong>
                <span>estensioni da installare</span>
              </div>
            </div>
            <Btn to="/shop?deals=1&sort=deal" tone="ink" size="lg">
              Vedi le offerte vere
            </Btn>
          </div>
        </div>
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className="section section--tight">
        <Carousel eyebrow="Reparti" title="Acquista per categoria" wide>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="catcard">
              <Photo id={CATEGORY_PHOTOS[c.id][1] ?? CATEGORY_PHOTOS[c.id][0]} alt={c.label} w={700} label={c.label} />
              <span className="catcard__label">{c.label}</span>
            </Link>
          ))}
        </Carousel>
      </section>

      {/* ---------- Full-bleed banner ---------- */}
      <section className="banner">
        <Photo id={EDITORIAL.people} alt="Persone al lavoro con dispositivi" w={1800} />
        <div className="banner__shade" />
        <div className="container banner__content">
          <p className="eyebrow eyebrow--light">Plus</p>
          <h2 className="display display--light">Spedizione gratis. Sempre.</h2>
          <p>Express a metà prezzo, resi a 60 giorni, accesso anticipato alle offerte. 30 giorni gratis.</p>
          <Btn to="/account#membership" tone="light" size="lg">
            Prova Plus
          </Btn>
        </div>
      </section>

      {/* ---------- Deals ---------- */}
      <section className="section section--tight">
        <Carousel eyebrow="Sconti reali" title="Offerte vere" to="/shop?deals=1&sort=deal">
          {deals.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </Carousel>
      </section>

      {/* ---------- Built-in extensions ---------- */}
      <section className="container section">
        <SectionTitle
          eyebrow="Già incluse"
          title="Le estensioni che non devi più installare"
          action={
            <Btn to="/account#estensioni" tone="account">
              Gestisci
            </Btn>
          }
        />
        <div className="exts">
          {Object.entries(EXTENSION_INFO).map(([k, e], i) => (
            <Reveal key={k} delay={i * 0.04} className="ext">
              <span className="ext__n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <span className="ext__rep">Al posto di {e.replaces}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container">
        <Rule />
      </div>

      {/* ---------- Infinite feed ---------- */}
      <section className="container section section--flush-top">
        <SectionTitle eyebrow="Per te" title="Continua a esplorare" />
        <InfiniteGrid query={{ hideSponsored }} />
      </section>
    </>
  )
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <header className="stitle">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="display display--sm">{title}</h2>
      </div>
      {action}
    </header>
  )
}

function FeatureTile({ to, photo, kicker, title, cta }: { to: string; photo: string; kicker: string; title: string; cta: string }) {
  return (
    <Reveal>
      <Link to={to} className="ftile">
        <Photo id={photo} alt={title} w={1100} label={kicker} />
        <div className="ftile__copy">
          <p className="eyebrow eyebrow--light">{kicker}</p>
          <h3>{title}</h3>
          <span className="btn btn--light btn--md">
            <span className="btn__label">{cta}</span>
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

function Carousel({ eyebrow, title, to, children, wide }: { eyebrow: string; title: string; to?: string; children: ReactNode; wide?: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="carousel">
      <div className="container">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          action={
            <div className="carousel__nav">
              {to && (
                <Link to={to} className="linkbtn">
                  Vedi tutto
                </Link>
              )}
              <button onClick={() => scroll(-1)} aria-label="Indietro">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => scroll(1)} aria-label="Avanti">
                <ArrowRight size={18} />
              </button>
            </div>
          }
        />
      </div>
      <div ref={track} className={`carousel__track${wide ? ' carousel__track--wide' : ''}`} data-lenis-prevent-wheel>
        {children}
      </div>
    </div>
  )
}
