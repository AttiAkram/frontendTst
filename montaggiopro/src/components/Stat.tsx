import { C } from "../tokens"

interface Props { label: string; value: string | number }

export function Stat({ label, value }: Props) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: C.font }}>{value}</div>
      <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{label}</div>
    </div>
  )
}
