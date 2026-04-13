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
      <Toggle label="Profilo pubblico" description="Visibile a tutti" checked={form.profiloPubblico} onChange={v => update("profiloPubblico", v)} />
      <Toggle label="Mostra disponibilità" description="Calendario sul profilo" checked={form.mostraDisp} onChange={v => update("mostraDisp", v)} />
      <Toggle label="Mostra statistiche" description="Lavori, recensioni e rating" checked={form.mostraStats} onChange={v => update("mostraStats", v)} />
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: C.font, marginBottom: 6 }}>Chi può scriverti</div>
        <div style={{ display: "flex", gap: 6 }}>
          {MSG_OPTIONS.map(o => (
            <button key={o.key} onClick={() => update("messaggiDa", o.key)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 500,
              fontFamily: C.font, cursor: "pointer",
              border: `1px solid ${form.messaggiDa === o.key ? C.text : C.border}`,
              background: form.messaggiDa === o.key ? C.text : C.white,
              color: form.messaggiDa === o.key ? C.white : C.text,
              transition: "all 150ms",
            }}>{o.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
