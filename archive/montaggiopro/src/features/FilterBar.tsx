import { Filter } from "lucide-react"
import { Chip } from "../components/Chip"

interface Props { filters: string[]; active: string | null; onChange: (f: string | null) => void }

export function FilterBar({ filters, active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 0" }}>
      <Chip label="Tutti" icon={Filter} active={active === null} onClick={() => onChange(null)} />
      {filters.map(f => (
        <Chip key={f} label={f} active={active === f} onClick={() => onChange(active === f ? null : f)} />
      ))}
    </div>
  )
}
