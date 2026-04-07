import { C } from "../../tokens"

const shimmer = {
  background: `linear-gradient(90deg, ${C.border}00 0%, ${C.border} 50%, ${C.border}00 100%)`,
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: 4,
}

function Sk({ w = "100%", h = 16, r = 4, mb = 0 }: { w?: string | number; h?: number; r?: number; mb?: number }) {
  return <div style={{ ...shimmer, width: w, height: h, borderRadius: r, marginBottom: mb, background: C.border }} />
}

export function SkPost() {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Sk w={36} h={36} r={18} />
        <div><Sk w={120} h={12} mb={6} /><Sk w={80} h={10} /></div>
      </div>
      <Sk w="100%" h={300} r={8} mb={12} />
      <Sk w="60%" h={12} mb={6} />
      <Sk w="40%" h={12} />
    </div>
  )
}
