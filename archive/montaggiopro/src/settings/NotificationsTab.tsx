import { Toggle } from "../components/Toggle"
import type { NotifPrefs } from "../types"

interface Props { form: NotifPrefs; update: (key: keyof NotifPrefs, val: boolean) => void }

const ITEMS: { key: keyof NotifPrefs; label: string; desc: string }[] = [
  { key: "nuoviLavori",   label: "Nuovi lavori",    desc: "Nuovi lavori nella tua zona" },
  { key: "messaggi",      label: "Messaggi",        desc: "Nuovi messaggi ricevuti" },
  { key: "recensioni",    label: "Recensioni",      desc: "Nuove recensioni" },
  { key: "aggiornamenti", label: "Aggiornamenti",   desc: "Novità della piattaforma" },
  { key: "newsletter",    label: "Newsletter",      desc: "Report settimanale" },
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
