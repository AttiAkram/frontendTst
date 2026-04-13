import { Star } from "lucide-react"
import { C } from "../tokens"

interface Props { value: number; count?: number; size?: number }

export function StarRating({ value, count, size = 12 }: Props) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: C.font }}>
      <Star size={size} fill={C.text} color={C.text} />
      <span style={{ fontWeight: 600, fontSize: size, color: C.text }}>{value.toFixed(1)}</span>
      {count !== undefined && (
        <span style={{ fontSize: size - 1, color: C.sub }}>({count})</span>
      )}
    </span>
  )
}
