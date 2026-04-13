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
    width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 13,
    fontFamily: C.font, color: C.text, outline: "none",
    border: `1px solid ${focused ? C.text : C.border}`,
    background: C.white, transition: "border-color 150ms",
  } as const

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.sub, marginBottom: 4, fontFamily: C.font }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...shared, resize: "vertical", minHeight: 72 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={shared} />
      )}
    </div>
  )
}
