import { Avatar } from "../components/Avatar"
import { StarRating } from "../components/StarRating"
import { C } from "../tokens"
import type { Review } from "../types"

interface Props { review: Review }

export function ReviewCard({ review }: Props) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Avatar char={review.store.char} colors={review.store.colors} size={28} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{review.store.name}</div>
          <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{review.date}</div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <div style={{ fontSize: 13, color: C.text, fontFamily: C.font, lineHeight: 1.4, marginBottom: 8 }}>{review.text}</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {review.tags.map(t => (
          <span key={t} style={{
            padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500,
            background: C.bg, color: C.sub, fontFamily: C.font,
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}
