import { useState } from "react"
import { Send } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { C } from "../tokens"
import type { Conversation, ChatMessage } from "../types"

interface Props { convs: Conversation[]; chatMsgs: ChatMessage[] }

export function MessagesDesktop({ convs, chatMsgs }: Props) {
  const [activeConv, setActiveConv] = useState(0)
  const [msgs, setMsgs] = useState(chatMsgs)
  const [input, setInput] = useState("")
  const conv = convs[activeConv]

  const send = () => {
    if (!input.trim()) return
    setMsgs(m => [...m, { id: Date.now(), text: input, me: true }])
    setInput("")
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 48px)", background: C.white, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ width: 300, borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
        <div style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>Messaggi</div>
        {convs.map((c, i) => (
          <div key={c.id} onClick={() => setActiveConv(i)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer",
            background: i === activeConv ? C.bg : "transparent",
          }}>
            <Avatar char={c.char} colors={c.colors} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: c.unread ? 600 : 400, color: C.text, fontFamily: C.font }}>{c.name}</div>
              <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <span style={{ fontSize: 10, color: C.sub, fontFamily: C.font }}>{c.time}</span>
              {c.unread > 0 && (
                <span style={{ background: C.text, color: C.white, fontSize: 9, fontWeight: 600, borderRadius: 8, padding: "1px 5px", fontFamily: C.font }}>{c.unread}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {conv && (
          <>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar char={conv.char} colors={conv.colors} size={28} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{conv.name}</div>
                <div style={{ fontSize: 11, color: C.green, fontFamily: C.font }}>Online</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {msgs.map(m => (
                <div key={m.id} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "65%" }}>
                  <div style={{
                    padding: "7px 12px", borderRadius: 14, fontSize: 13, fontFamily: C.font,
                    background: m.me ? C.text : C.bg, color: m.me ? C.white : C.text,
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Scrivi un messaggio..."
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 18, border: `1px solid ${C.border}`,
                  fontSize: 13, fontFamily: C.font, outline: "none",
                }} />
              <button onClick={send} style={{
                width: 34, height: 34, borderRadius: "50%", border: "none",
                background: C.text, color: C.white, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Send size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
