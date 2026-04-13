import { C } from "../tokens"

interface Props {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ label, description, checked, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: C.font }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font, marginTop: 1 }}>{description}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
        background: checked ? C.text : C.border, position: "relative",
        transition: "background 150ms", flexShrink: 0,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%", background: C.white,
          position: "absolute", top: 3,
          left: checked ? 19 : 3, transition: "left 150ms",
        }} />
      </button>
    </div>
  )
}
