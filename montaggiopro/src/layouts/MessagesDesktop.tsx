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
    <div style={{ display: "flex", height: "calc(100vh - 60px)", background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
        <div style={{ padding: 16, fontSize: 16, fontWeight: 700, color: C.text, fontFamily: C.font }}>Messaggi</div>
        {convs.map((c, i) => (
          <div key={c.id} onClick={() => setActiveConv(i)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer",
            background: i === activeConv ? C.bg : "transparent",
          }}>
            <Avatar char={c.char} colors={c.colors} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: c.unread ? 700 : 400, color: C.text, fontFamily: C.font }}>{c.name}</div>
              <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{c.time}</span>
              {c.unread > 0 && (
                <span style={{ background: C.accent, color: C.white, fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "2px 6px", fontFamily: C.font }}>{c.unread}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {conv && (
          <>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar char={conv.char} colors={conv.colors} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{conv.name}</div>
                <div style={{ fontSize: 12, color: C.green, fontFamily: C.font }}>Disponibile</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.map(m => (
                <div key={m.id} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  <div style={{
                    padding: "8px 14px", borderRadius: 16, fontSize: 14, fontFamily: C.font,
                    background: m.me ? C.accent : C.white, color: m.me ? C.white : C.text,
                    border: m.me ? "none" : `1px solid ${C.border}`,
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Scrivi un messaggio..."
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 20, border: `1px solid ${C.border}`,
                  fontSize: 14, fontFamily: C.font, outline: "none",
                }} />
              <button onClick={send} style={{
                width: 40, height: 40, borderRadius: "50%", border: "none",
                background: C.accent, color: C.white, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
