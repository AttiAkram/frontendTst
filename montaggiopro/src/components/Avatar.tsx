import { Check } from "lucide-react"
import { C } from "../tokens"

interface Props {
  char:     string
  colors:   [string, string]
  size?:    number
  ring?:    boolean
  verified?:boolean
}

export function Avatar({ char, colors, size = 36, ring = false, verified = false }: Props) {
  const [c1, c2] = colors
  const pad = ring ? 2 : 0

  return (
    <div style={{ position:"relative", width:size+pad*2, height:size+pad*2, flexShrink:0 }}>
      <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:ring?"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)":"transparent", padding:pad }}>
        <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${c1},${c2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:700, color:"#fff" }}>
          {char}
        </div>
      </div>
      {verified && (
        <div style={{ position:"absolute", bottom:0, right:0, width:16, height:16, background:C.accent, borderRadius:"50%", border:`2px solid ${C.white}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Check size={9} color="#fff" />
        </div>
      )}
    </div>
  )
}
