import { C } from "../tokens"

interface Props {
  label?: string
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}

export function MultiChip({ label, options, selected, onChange }: Props) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter(s => s !== o) : [...selected, o])

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 500, color: C.sub, fontFamily: C.font, marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(o => {
          const active = selected.includes(o)
          return (
            <button key={o} onClick={() => toggle(o)} style={{
              padding: "5px 12px", borderRadius: 18, fontSize: 12, fontWeight: 500,
              fontFamily: C.font, cursor: "pointer",
              background: active ? C.text : C.white,
              color: active ? C.white : C.text,
              border: `1px solid ${active ? C.text : C.border}`,
              transition: "all 150ms",
            }}>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
