import { useState, useCallback, useEffect } from "react"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin, Wrench } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { Badge } from "../components/Badge"
import { C } from "../tokens"
import { Post } from "../types"

interface Props { post: Post; delay?: number }

export function PostCard({ post, delay = 0 }: Props) {
  const [liked,  setLiked]  = useState(post.liked  ?? false)
  const [saved,  setSaved]  = useState(false)
  const [count,  setCount]  = useState(post.likes)
  const [in_,    setIn]     = useState(false)

  useEffect(() => { const t = setTimeout(() => setIn(true), delay); return () => clearTimeout(t) }, [delay])

  const toggleLike = useCallback(() => {
    setLiked(v => !v)
    setCount(v => liked ? v - 1 : v + 1)
  }, [liked])

  const [c1, c2] = post.team.colors

  return (
    <article style={{ background:C.white, borderBottom:`1px solid ${C.border}`, opacity:in_?1:0, transform:in_?"none":"translateY(8px)", transition:"opacity .35s ease,transform .35s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 12px 10px" }}>
        <Avatar char={post.team.char} colors={post.team.colors} size={36} ring verified={post.team.verified} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{post.team.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.sub }}>
            <MapPin size={10} /> {post.city} · {post.time}
          </div>
        </div>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, display:"flex", padding:4 }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Media placeholder — sostituire con <img src={post.media_url} /> */}
      <div style={{ width:"100%", aspectRatio:"1", background:`linear-gradient(135deg,${c1}44,${c2}66)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <Wrench size={52} color={`${c1}66`} strokeWidth={0.7} />
        <div style={{ position:"absolute", top:10, left:10 }}>
          <Badge label={post.tags[0]} color="#fff" bg={`${c1}dd`} />
        </div>
      </div>

      <div style={{ padding:"6px 8px 2px" }}>
        <div style={{ display:"flex", alignItems:"center" }}>
          <button onClick={toggleLike} style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex", transform:liked?"scale(1.25)":"scale(1)", transition:"transform .2s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <Heart size={22} fill={liked?C.red:"none"} color={liked?C.red:C.text} />
          </button>
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex" }}><MessageCircle size={22} color={C.text} /></button>
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex" }}><Send size={22} color={C.text} /></button>
          <div style={{ flex:1 }} />
          <button onClick={() => setSaved(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex" }}>
            <Bookmark size={22} fill={saved?C.text:"none"} color={C.text} />
          </button>
        </div>
        <div style={{ paddingLeft:6, paddingBottom:4 }}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{count.toLocaleString()} mi piace</div>
          <div style={{ fontSize:13, color:C.text, lineHeight:1.5, marginTop:2 }}>
            <span style={{ fontWeight:600 }}>{post.team.name} </span>{post.caption}
          </div>
          <div style={{ marginTop:2 }}>{post.tags.map(t => <span key={t} style={{ color:C.accent, fontSize:13 }}>#{t} </span>)}</div>
          <div style={{ color:C.sub, fontSize:12, marginTop:4, cursor:"pointer" }}>Vedi tutti i {post.comments} commenti</div>
        </div>
      </div>
    </article>
  )
}
