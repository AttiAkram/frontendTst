import { useState } from "react"
import { C } from "../tokens"

interface Props {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  type?: string
}

export function Input({ label, value, onChange, placeholder, multiline, type = "text" }: Props) {
  const [focused, setFocused] = useState(false)
  const shared = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    fontFamily: C.font, color: C.text, outline: "none",
    border: `1px solid ${focused ? C.accent : C.border}`,
    background: C.white, transition: "border-color 200ms",
  } as const

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, fontFamily: C.font }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...shared, resize: "vertical", minHeight: 80 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={shared} />
      )}
    </div>
  )
}
