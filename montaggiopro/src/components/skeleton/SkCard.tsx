import { C } from "../../tokens"

function Sk({ w = "100%", h = 16 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, borderRadius: 4, background: C.border }} />
}

export function SkCard() {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Sk w={40} h={40} />
        <div style={{ flex: 1 }}><Sk w="70%" h={12} /></div>
      </div>
      <Sk w="100%" h={10} /><div style={{ height: 6 }} />
      <Sk w="80%" h={10} /><div style={{ height: 6 }} />
      <Sk w="50%" h={10} />
    </div>
  )
}
