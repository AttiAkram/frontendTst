import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Wrench } from "lucide-react"
import { C } from "../tokens"
import { Avatar } from "../components/Avatar"
import type { Post } from "../types"

interface Props { post: Post; delay?: number }

export function PostCard({ post, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [liked, setLiked] = useState(post.liked ?? false)
  const [saved, setSaved] = useState(post.saved ?? false)
  const [likes, setLikes] = useState(post.likes)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  const toggleLike = () => {
    setLiked(l => !l)
    setLikes(n => liked ? n - 1 : n + 1)
  }

  return (
    <div style={{
      background: C.white, borderRadius: 12, marginBottom: 12, overflow: "hidden",
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 12}px)`,
      transition: "opacity 250ms, transform 250ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 8 }}>
        <Avatar char={post.team.char} colors={post.team.colors} size={32} verified={post.team.verified} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{post.team.name}</div>
          <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{post.city} · {post.time}</div>
        </div>
        <MoreVertical size={16} color={C.sub} style={{ cursor: "pointer" }} />
      </div>
      <div style={{
        aspectRatio: "16/9", background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Wrench size={32} color={C.sub} style={{ opacity: 0.2 }} />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <Heart size={18} fill={liked ? C.red : "none"} color={liked ? C.red : C.text}
            strokeWidth={1.5}
            style={{ cursor: "pointer", transition: "transform 150ms" }}
            onClick={toggleLike} />
          <MessageCircle size={18} color={C.text} strokeWidth={1.5} style={{ cursor: "pointer" }} />
          <Share2 size={18} color={C.text} strokeWidth={1.5} style={{ cursor: "pointer" }} />
          <div style={{ flex: 1 }} />
          <Bookmark size={18} fill={saved ? C.text : "none"} color={C.text}
            strokeWidth={1.5}
            style={{ cursor: "pointer" }} onClick={() => setSaved(s => !s)} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 2 }}>{likes} like</div>
        <div style={{ fontSize: 13, color: C.text, fontFamily: C.font, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>{post.team.name.split(" ")[0]}</span> {post.caption}
        </div>
        {post.tags.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: 12, color: C.sub, fontFamily: C.font, marginRight: 6 }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
