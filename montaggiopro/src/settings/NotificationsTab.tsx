import { Toggle } from "../components/Toggle"
import type { NotifPrefs } from "../types"

interface Props { form: NotifPrefs; update: (key: keyof NotifPrefs, val: boolean) => void }

const ITEMS: { key: keyof NotifPrefs; label: string; desc: string }[] = [
  { key: "nuoviLavori",   label: "Nuovi lavori",    desc: "Ricevi notifiche quando vengono pubblicati nuovi lavori nella tua zona" },
  { key: "messaggi",      label: "Messaggi",        desc: "Notifiche per nuovi messaggi ricevuti" },
  { key: "recensioni",    label: "Recensioni",      desc: "Notifiche quando ricevi una nuova recensione" },
  { key: "aggiornamenti", label: "Aggiornamenti",   desc: "Novità sulla piattaforma e nuove funzionalità" },
  { key: "newsletter",    label: "Newsletter",      desc: "Report settimanale con statistiche e opportunità" },
]

export function NotificationsTab({ form, update }: Props) {
  return (
    <div>
      {ITEMS.map(i => (
        <Toggle key={i.key} label={i.label} description={i.desc}
          checked={form[i.key]} onChange={v => update(i.key, v)} />
      ))}
    </div>
  )
}
