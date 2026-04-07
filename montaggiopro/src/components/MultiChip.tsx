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
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 8 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(o => {
          const active = selected.includes(o)
          return (
            <button key={o} onClick={() => toggle(o)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              fontFamily: C.font, cursor: "pointer", whiteSpace: "nowrap",
              background: active ? "rgba(0,149,246,0.15)" : C.white,
              color: active ? C.accent : C.text,
              border: `1px solid ${active ? C.accent : C.border}`,
              transition: "all 200ms",
            }}>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
