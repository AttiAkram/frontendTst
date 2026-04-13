import { C } from "../../tokens"

function Sk({ w = "100%", h = 12 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, borderRadius: 4, background: C.border }} />
}

export function SkCard() {
  return (
    <div style={{ background: C.white, borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Sk w={32} h={32} />
        <div style={{ flex: 1 }}><Sk w="60%" h={10} /></div>
      </div>
      <Sk w="100%" h={8} /><div style={{ height: 4 }} />
      <Sk w="70%" h={8} />
    </div>
  )
}
