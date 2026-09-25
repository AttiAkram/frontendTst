import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ArrowUpRight, ShoppingBag, Heart, User, Zap } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { InfiniteGrid } from '../components/InfiniteGrid'
import { ProductArt } from '../components/ProductArt'
import { Btn, DealMeter, Reveal, Rule, SectionHead } from '../components/ui'
import { CATEGORIES, PRODUCTS, dealScore, realDiscount } from '../data/catalog'
import { money } from '../lib/format'
import { EXTENSION_INFO, useStore } from '../store/store'

export function Home() {
  const hero = PRODUCTS[8]
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const artRot = useTransform(scrollYProgress, [0, 1], [0, -18])
  const hideSponsored = useStore((s) => s.extensions.hideSponsored)
  const addToCart = useStore((s) => s.addToCart)
  const deals = useMemo(() => [...PRODUCTS].filter((p) => realDiscount(p) > 8).sort((a, b) => dealScore(b) - dealScore(a)).slice(0, 10), [])

  return (
    <>
      <section className="hero container" ref={heroRef}>
        <div className="hero__copy">
          <motion.p className="mono up small muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            ● Store / 2026 — Collezione 03
          </motion.p>
          <h1 className="hero__title">
            {['Tutto.', 'Niente', 'di più.'].map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.2, 0.7, 0.1, 1] }}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero__lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            Tecnologia essenziale, prezzi trasparenti con storico reale, recensioni verificate. Gli strumenti che installavi come estensioni sono già qui.
          </motion.p>
          <motion.div className="hero__cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
            <Btn to="/shop" tone="ink" size="lg" icon={<ArrowRight size={16} />}>
              Entra nello shop
            </Btn>
            <Btn to="/shop?deals=1&sort=deal" tone="ghost" size="lg">
              Offerte vere
            </Btn>
          </motion.div>
          <motion.ul className="signals" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.08, delayChildren: 0.9 } } }}>
            {[
              ['cart', 'Carrello', <ShoppingBag size={14} key="c" />],
              ['buy', 'Compra ora', <Zap size={14} key="b" />],
              ['fav', 'Preferiti', <Heart size={14} key="f" />],
              ['account', 'Account', <User size={14} key="a" />],
            ].map(([tone, label, icon]) => (
              <motion.li key={tone as string} variants={{ h: { opacity: 0, x: -10 }, s: { opacity: 1, x: 0 } }}>
                <span className={`signal signal--${tone}`}>{icon}</span>
                <span className="mono small">{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="hero__stage">
          <div className="hero__grid" aria-hidden />
          <motion.div className="hero__art" style={{ y: artY, rotate: artRot }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.1, 1] }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <ProductArt category={hero.category} color="#f5f5f3" size="100%" />
            </motion.div>
          </motion.div>
          <motion.div className="hero__card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
            <span className="mono small muted">{hero.id}</span>
            <Link to={`/p/${hero.id}`} className="strong">
              {hero.name}
            </Link>
            <span className="mono">{money(hero.price)}</span>
            <div className="hero__card-actions">
              <Btn tone="cart" size="sm" onClick={() => addToCart(hero.id, hero.variants[0].id)}>
                Carrello
              </Btn>
              <Btn tone="buy" size="sm" to={`/p/${hero.id}`}>
                Scopri
              </Btn>
            </div>
          </motion.div>
          <span className="hero__coord mono small muted">45.4642° N · 9.1900° E</span>
        </div>
      </section>

      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              {['Spedizione gratuita da 39 €', 'Reso 30 giorni', 'Storico prezzi su ogni prodotto', 'Recensioni verificate A–F', 'Apple Pay · Google Pay · PayPal', 'Coupon applicati da soli'].map((t) => (
                <span key={t}>
                  {t} <i>●</i>{' '}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="container section">
        <SectionHead index="01" kicker="8 reparti" title="Categorie" action={<Btn to="/shop" size="sm" icon={<ArrowUpRight size={14} />}>Tutto</Btn>} />
        <div className="cats">
          {CATEGORIES.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c.id).length
            return (
              <Reveal key={c.id} delay={i * 0.04}>
                <Link to={`/shop?category=${c.id}`} className="cat">
                  <span className="mono small muted">
                    {String(i + 1).padStart(2, '0')} / {c.code}
                  </span>
                  <motion.span className="cat__art" whileHover={{ scale: 1.1, rotate: 4 }}>
                    <ProductArt category={c.id} color={i % 3 === 1 ? '#141414' : '#f5f5f3'} />
                  </motion.span>
                  <span className="cat__foot">
                    <strong>{c.label}</strong>
                    <span className="mono small muted">{count}</span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <div className="container">
        <Rule index="01" label="fine categorie" />
      </div>

      <section className="container section">
        <SectionHead index="02" kicker="sconto su mediana 90gg" title="Offerte vere" action={<Btn to="/shop?deals=1&sort=deal" size="sm" icon={<ArrowUpRight size={14} />}>Tutte</Btn>} />
        <div className="hscroll" data-lenis-prevent-wheel>
          {deals.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} className="deal">
              <Link to={`/p/${p.id}`} className="deal__inner">
                <span className="deal__pct">−{realDiscount(p)}%</span>
                <span className="deal__art">
                  <ProductArt category={p.category} color={p.variants[0].swatch} seed={i} />
                </span>
                <span className="small strong">{p.name}</span>
                <span className="deal__row">
                  <span className="mono">{money(p.price)}</span>
                  <DealMeter score={dealScore(p)} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container">
        <Rule index="02" label="fine offerte" variant="dashdot" />
      </div>

      <section className="container section">
        <SectionHead index="03" kicker="zero installazioni" title="Estensioni già dentro" action={<Btn to="/account#estensioni" tone="account" size="sm">Gestisci</Btn>} />
        <div className="exts">
          {Object.entries(EXTENSION_INFO).map(([k, e], i) => (
            <Reveal key={k} delay={i * 0.05} className="ext">
              <span className="mono small muted">{String(i + 1).padStart(2, '0')}</span>
              <h3>{e.title}</h3>
              <p className="small muted">{e.desc}</p>
              <span className="mono small ext__rep">sostituisce → {e.replaces}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container">
        <Rule index="03" label="fine estensioni" />
      </div>

      <section className="container section">
        <SectionHead index="04" kicker="caricamento automatico" title="Per te" />
        <InfiniteGrid query={{ hideSponsored }} />
      </section>
    </>
  )
}
