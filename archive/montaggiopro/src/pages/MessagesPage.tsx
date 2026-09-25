import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { MessagesDesktop } from "../layouts/MessagesDesktop"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { C } from "../tokens"
import { CONVS, CHAT } from "../data/mock"
import type { Conversation, ChatMessage } from "../types"

export function MessagesPage() {
  const bp = useBreakpoint()
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [msgs, setMsgs] = useState<ChatMessage[]>(CHAT)
  const [input, setInput] = useState("")

  if (bp !== "mobile") return <MessagesDesktop convs={CONVS} chatMsgs={CHAT} />

  if (activeConv) {
    const send = () => {
      if (!input.trim()) return
      setMsgs(m => [...m, { id: Date.now(), text: input, me: true }])
      setInput("")
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, borderBottom: `1px solid ${C.border}`, background: C.white }}>
          <button onClick={() => setActiveConv(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
            <ArrowLeft size={18} color={C.text} />
          </button>
          <Avatar char={activeConv.char} colors={activeConv.colors} size={28} />
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{activeConv.name}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "75%" }}>
              <div style={{
                padding: "7px 12px", borderRadius: 14, fontSize: 13, fontFamily: C.font,
                background: m.me ? C.text : C.bg, color: m.me ? C.white : C.text,
              }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 6, background: C.white }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Scrivi..." style={{
              flex: 1, padding: "8px 12px", borderRadius: 18, border: `1px solid ${C.border}`,
              fontSize: 13, fontFamily: C.font, outline: "none",
            }} />
          <button onClick={send} style={{
            width: 34, height: 34, borderRadius: "50%", border: "none",
            background: C.text, color: C.white, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Send size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 12 }}>Messaggi</div>
      {CONVS.map(c => (
        <div key={c.id} onClick={() => setActiveConv(c)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: 10, cursor: "pointer",
          background: C.white, borderRadius: 10, marginBottom: 6,
        }}>
          <Avatar char={c.char} colors={c.colors} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: c.unread ? 600 : 400, color: C.text, fontFamily: C.font }}>{c.name}</div>
            <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <span style={{ fontSize: 10, color: C.sub }}>{c.time}</span>
            {c.unread > 0 && (
              <span style={{ background: C.text, color: C.white, fontSize: 9, fontWeight: 600, borderRadius: 8, padding: "1px 5px" }}>{c.unread}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
