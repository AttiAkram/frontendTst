import { Toggle } from "../components/Toggle"
import { C } from "../tokens"
import type { PrivacyPrefs, MessageTarget } from "../types"

interface Props { form: PrivacyPrefs; update: (key: keyof PrivacyPrefs, val: boolean | MessageTarget) => void }

const MSG_OPTIONS: { key: MessageTarget; label: string }[] = [
  { key: "tutti", label: "Tutti" },
  { key: "verificati", label: "Verificati" },
  { key: "nessuno", label: "Nessuno" },
]

export function PrivacyTab({ form, update }: Props) {
  return (
    <div>
      <Toggle label="Profilo pubblico" description="Rendi il tuo profilo visibile a tutti"
        checked={form.profiloPubblico} onChange={v => update("profiloPubblico", v)} />
      <Toggle label="Mostra disponibilità" description="Mostra il calendario disponibilità sul profilo"
        checked={form.mostraDisp} onChange={v => update("mostraDisp", v)} />
      <Toggle label="Mostra statistiche" description="Mostra lavori completati, recensioni e rating"
        checked={form.mostraStats} onChange={v => update("mostraStats", v)} />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: C.font, marginBottom: 4 }}>Chi può scriverti</div>
        <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font, marginBottom: 12 }}>Scegli chi può inviarti messaggi diretti</div>
        <div style={{ display: "flex", gap: 8 }}>
          {MSG_OPTIONS.map(o => (
            <button key={o.key} onClick={() => update("messaggiDa", o.key)} style={{
              flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
              fontFamily: C.font, cursor: "pointer",
              border: `1px solid ${form.messaggiDa === o.key ? C.accent : C.border}`,
              background: form.messaggiDa === o.key ? "rgba(0,149,246,0.1)" : C.white,
              color: form.messaggiDa === o.key ? C.accent : C.text,
              transition: "all 200ms",
            }}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
