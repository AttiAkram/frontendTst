import type { ReactNode } from "react"
import { C } from "../tokens"

interface Props { title: string; description?: string; children: ReactNode }

export function SettingsSection({ title, description, children }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font, marginTop: 2 }}>{description}</div>}
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  )
}
