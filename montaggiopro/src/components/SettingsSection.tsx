import type { ReactNode } from "react"
import { C } from "../tokens"

interface Props { title: string; description?: string; children: ReactNode }

export function SettingsSection({ title, description, children }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: C.font }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: C.sub, fontFamily: C.font, marginTop: 2 }}>{description}</div>}
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  )
}
