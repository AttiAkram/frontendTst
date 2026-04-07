import { useState, useEffect } from "react"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Wrench } from "lucide-react"
import { C } from "../tokens"
import { Avatar } from "../components/Avatar"
import type { Post } from "../types"

interface Props { post: Post; delay?: number }

export function PostCard({ post, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [liked, setLiked] = useState(post.liked ?? false)
  const [saved, setSaved] = useState(post.saved ?? false)
  const [likes, setLikes] = useState(post.likes)
  const [likeScale, setLikeScale] = useState(1)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  const toggleLike = () => {
    setLiked(l => !l)
    setLikes(n => liked ? n - 1 : n + 1)
    if (!liked) { setLikeScale(1.25); setTimeout(() => setLikeScale(1), 300) }
  }

  return (
    <div style={{
      background: C.white, borderRadius: 12, marginBottom: 16, overflow: "hidden",
      border: `1px solid ${C.border}`,
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 20}px)`,
      transition: "opacity 350ms, transform 350ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", padding: 14, gap: 10 }}>
        <Avatar char={post.team.char} colors={post.team.colors} size={36} ring verified={post.team.verified} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{post.team.name}</div>
          <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{post.city} · {post.time}</div>
        </div>
        <MoreHorizontal size={18} color={C.sub} style={{ cursor: "pointer" }} />
      </div>
      <div style={{
        aspectRatio: "1/1", background: `linear-gradient(135deg, ${post.team.colors[0]}, ${post.team.colors[1]})`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Wrench size={48} color="rgba(255,255,255,0.3)" />
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
          <Heart size={22} fill={liked ? C.red : "none"} color={liked ? C.red : C.text}
            style={{ cursor: "pointer", transform: `scale(${likeScale})`, transition: "transform 300ms cubic-bezier(.17,.67,.21,1.3)" }}
            onClick={toggleLike} />
          <MessageCircle size={22} color={C.text} style={{ cursor: "pointer" }} />
          <Send size={22} color={C.text} style={{ cursor: "pointer" }} />
          <div style={{ flex: 1 }} />
          <Bookmark size={22} fill={saved ? C.text : "none"} color={C.text}
            style={{ cursor: "pointer" }} onClick={() => setSaved(s => !s)} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 4 }}>{likes} like</div>
        <div style={{ fontSize: 14, color: C.text, fontFamily: C.font }}>
          <span style={{ fontWeight: 600 }}>{post.team.name}</span> {post.caption}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {post.tags.map(t => (
            <span key={t} style={{ fontSize: 12, color: C.accent, fontFamily: C.font }}>#{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
