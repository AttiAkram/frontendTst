import { motion } from 'motion/react'
import { Fingerprint, KeyRound, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type AuthProvider, signIn } from '../api/client'
import { AppleMark, GoogleG } from '../components/Marks'
import { Btn, Rule } from '../components/ui'
import { useStore } from '../store/store'

export function Login() {
  const login = useStore((s) => s.login)
  const nav = useNavigate()
  const [busy, setBusy] = useState<AuthProvider | null>(null)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const go = async (p: AuthProvider, mail?: string) => {
    setBusy(p)
    const u = await signIn(p, mail)
    login(u)
    nav('/account')
  }

  return (
    <div className="container auth">
      <motion.div className="auth__card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mono up small muted">● Accesso</p>
        <h1 className="dot-title">Ciao.</h1>
        <p className="muted small">Un solo account per ordini, resi, avvisi prezzo ed estensioni.</p>

        <div className="auth__providers">
          <button className="authbtn" onClick={() => go('google')} disabled={!!busy}>
            <GoogleG /> <span>Continua con Google</span>
            {busy === 'google' && <span className="spinner" />}
          </button>
          <button className="authbtn authbtn--apple" onClick={() => go('apple')} disabled={!!busy}>
            <AppleMark /> <span>Continua con Apple</span>
            {busy === 'apple' && <span className="spinner spinner--light" />}
          </button>
          <button className="authbtn" onClick={() => go('passkey')} disabled={!!busy}>
            <KeyRound size={18} /> <span>Accedi con passkey</span>
            {busy === 'passkey' && <span className="spinner" />}
          </button>
        </div>

        <Rule label="oppure" variant="dashdot" />

        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!sent) return setSent(true)
            go('email', email)
          }}
        >
          <label className="fl">
            <span>Email</span>
            <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@esempio.it" autoComplete="email" />
          </label>
          {sent && (
            <motion.p className="small ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Mail size={13} /> Link magico inviato a {email}. (Demo: premi di nuovo per entrare.)
            </motion.p>
          )}
          <Btn type="submit" tone="account" size="lg" block icon={sent ? <Fingerprint size={16} /> : <Mail size={16} />}>
            {sent ? 'Ho cliccato il link' : 'Inviami il link'}
          </Btn>
        </form>
        <p className="mono small muted">Niente password da ricordare. 2FA e passkey nelle impostazioni.</p>
      </motion.div>
    </div>
  )
}
