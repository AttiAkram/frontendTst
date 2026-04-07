import { Filter } from "lucide-react"
import { Chip } from "../components/Chip"

interface Props { filters: string[]; active: string | null; onChange: (f: string | null) => void }

export function FilterBar({ filters, active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0", marginBottom: 8 }}>
      <Chip label="Tutti" icon={Filter} active={active === null} onClick={() => onChange(null)} />
      {filters.map(f => (
        <Chip key={f} label={f} active={active === f} onClick={() => onChange(active === f ? null : f)} />
      ))}
    </div>
  )
}
