import { C } from "../../tokens"

function Sk({ w = "100%", h = 14, r = 4, mb = 0 }: { w?: string | number; h?: number; r?: number; mb?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: C.border }} />
}

export function SkPost() {
  return (
    <div style={{ background: C.white, borderRadius: 8, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Sk w={32} h={32} r={16} />
        <div><Sk w={100} h={10} mb={4} /><Sk w={60} h={8} /></div>
      </div>
      <Sk w="100%" h={240} r={8} mb={10} />
      <Sk w="50%" h={10} mb={4} />
      <Sk w="30%" h={10} />
    </div>
  )
}
