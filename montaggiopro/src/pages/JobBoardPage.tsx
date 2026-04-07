import { useState } from "react"
import { Briefcase } from "lucide-react"
import { FilterBar } from "../features/FilterBar"
import { JobCard } from "../features/JobCard"
import { EmptyState } from "../components/skeleton/EmptyState"
import { JOBS } from "../data/mock"

const TYPE_FILTERS = ["Cucina","Bagno","Living","Camera","Ufficio","Armadio"]
const PROV_FILTERS = ["MO","BO","MI","RM","FI","NA"]

export function JobBoardPage() {
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [provFilter, setProvFilter] = useState<string | null>(null)

  const filtered = JOBS.filter(j =>
    (!typeFilter || j.type === typeFilter) &&
    (!provFilter || j.province === provFilter)
  )

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <FilterBar filters={TYPE_FILTERS} active={typeFilter} onChange={setTypeFilter} />
      <FilterBar filters={PROV_FILTERS} active={provFilter} onChange={setProvFilter} />
      {filtered.length === 0 ? (
        <EmptyState label="Nessun lavoro trovato" icon={Briefcase} />
      ) : (
        filtered.map((j, i) => <JobCard key={j.id} job={j} delay={i * 100} />)
      )}
    </div>
  )
}
