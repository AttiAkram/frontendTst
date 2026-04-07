import { C } from "../tokens"

interface Props {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ label, description, checked, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: C.font }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font, marginTop: 2 }}>{description}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: checked ? C.accent : C.border, position: "relative",
        transition: "background 200ms", flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: C.white,
          position: "absolute", top: 3,
          left: checked ? 23 : 3, transition: "left 200ms",
        }} />
      </button>
    </div>
  )
}
