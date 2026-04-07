import { Avatar } from "../components/Avatar"
import { StarRating } from "../components/StarRating"
import { C } from "../tokens"
import type { Review } from "../types"

interface Props { review: Review }

export function ReviewCard({ review }: Props) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 16, marginBottom: 12,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar char={review.store.char} colors={review.store.colors} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{review.store.name}</div>
          <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{review.date}</div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <div style={{ fontSize: 14, color: C.text, fontFamily: C.font, marginBottom: 10 }}>{review.text}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {review.tags.map(t => (
          <span key={t} style={{
            padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
            background: "#F0FDF4", color: "#15803D", fontFamily: C.font,
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}
