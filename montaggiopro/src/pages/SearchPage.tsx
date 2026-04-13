import { useState } from "react"
import { Search } from "lucide-react"
import { FilterBar } from "../features/FilterBar"
import { TeamCard } from "../features/TeamCard"
import { EmptyState } from "../components/skeleton/EmptyState"
import { SPEC_OPTIONS } from "../tokens"
import { TEAMS } from "../data/mock"
import { C } from "../tokens"
import type { Team } from "../types"

const CITY_FILTERS = ["Modena","Bologna","Milano","Roma","Firenze","Venezia","Napoli"]

interface Props { onTeamClick: (t: Team) => void }

export function SearchPage({ onTeamClick }: Props) {
  const [specFilter, setSpecFilter] = useState<string | null>(null)
  const [cityFilter, setCityFilter] = useState<string | null>(null)

  const filtered = TEAMS.filter(t =>
    (!specFilter || t.specs.includes(specFilter)) &&
    (!cityFilter || t.zones.includes(cityFilter))
  )

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "12px 16px" }}>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={16} color={C.sub} style={{ position: "absolute", left: 10, top: 9 }} />
        <input placeholder="Cerca squadre..." readOnly style={{
          width: "100%", padding: "8px 10px 8px 32px", borderRadius: 8,
          border: `1px solid ${C.border}`, fontSize: 13, fontFamily: C.font,
          background: C.bg, outline: "none",
        }} />
      </div>
      <FilterBar filters={SPEC_OPTIONS} active={specFilter} onChange={setSpecFilter} />
      <FilterBar filters={CITY_FILTERS} active={cityFilter} onChange={setCityFilter} />
      {filtered.length === 0
        ? <EmptyState label="Nessuna squadra trovata" icon={Search} />
        : filtered.map((t, i) => <TeamCard key={t.id} team={t} onClick={() => onTeamClick(t)} delay={i * 80} />)
      }
    </div>
  )
}
