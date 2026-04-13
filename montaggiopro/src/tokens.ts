export const C = {
  bg:     "#F2F2F2",
  white:  "#FFFFFF",
  border: "#E5E5E5",
  text:   "#0F0F0F",
  sub:    "#606060",
  accent: "#0F0F0F",
  red:    "#FF0000",
  green:  "#2BA640",
  amber:  "#FF8C00",
  font:   "'Montserrat', sans-serif",
} as const

export const PALETTES: [string, string][] = [
  ["#606060","#606060"], ["#0F0F0F","#0F0F0F"], ["#2BA640","#2BA640"],
  ["#065FD4","#065FD4"], ["#FF0000","#FF0000"], ["#FF8C00","#FF8C00"],
  ["#7C3AED","#7C3AED"], ["#0E7490","#0E7490"], ["#BE185D","#BE185D"],
]

export const AVAIL_STYLE = {
  free:    { bg: "#E8F5E9", color: "#2E7D32" },
  partial: { bg: "#FFF3E0", color: "#E65100" },
  busy:    { bg: "#FFEBEE", color: "#C62828" },
} as const

export const JOB_COLORS: Record<string, string> = {
  Cucina:  "#065FD4",
  Bagno:   "#7C3AED",
  Living:  "#2BA640",
  Camera:  "#FF8C00",
  Armadio: "#C62828",
  Ufficio: "#606060",
}

export const SPEC_OPTIONS  = ["Cucine","Bagni","Living","Camere","Armadi","Uffici","Contract"]
export const ZONE_OPTIONS  = ["Modena","Bologna","Reggio Emilia","Ferrara","Carpi","Sassuolo",
                              "Parma","Firenze","Milano","Roma","Napoli","Venezia","Torino"]
export const VAN_SIZES     = ["piccolo","medio","grande"] as const
