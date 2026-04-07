import { useState } from "react"
import { Search } from "lucide-react"
import { FilterBar } from "../features/FilterBar"
import { TeamCard } from "../features/TeamCard"
import { EmptyState } from "../components/skeleton/EmptyState"
import { C, SPEC_OPTIONS } from "../tokens"
import { TEAMS } from "../data/mock"
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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={18} color={C.sub} style={{ position: "absolute", left: 12, top: 11 }} />
        <input placeholder="Cerca squadre..." readOnly style={{
          width: "100%", padding: "10px 12px 10px 38px", borderRadius: 8,
          border: `1px solid ${C.border}`, fontSize: 14, fontFamily: C.font,
          background: C.white, outline: "none",
        }} />
      </div>
      <FilterBar filters={SPEC_OPTIONS} active={specFilter} onChange={setSpecFilter} />
      <FilterBar filters={CITY_FILTERS} active={cityFilter} onChange={setCityFilter} />
      {filtered.length === 0 ? (
        <EmptyState label="Nessuna squadra trovata" icon={Search} />
      ) : (
        filtered.map((t, i) => <TeamCard key={t.id} team={t} onClick={() => onTeamClick(t)} delay={i * 100} />)
      )}
    </div>
  )
}
