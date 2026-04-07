export const C = {
  bg:     "#FAFAFA",
  white:  "#FFFFFF",
  border: "#DBDBDB",
  text:   "#262626",
  sub:    "#8E8E8E",
  accent: "#0095F6",
  green:  "#22C55E",
  amber:  "#F59E0B",
  red:    "#EF4444",
  font:   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const

export const PALETTES: [string, string][] = [
  ["#0095F6","#00C6FF"], ["#8B5CF6","#D946EF"], ["#10B981","#34D399"],
  ["#F59E0B","#FCD34D"], ["#EF4444","#F97316"], ["#EC4899","#FB7185"],
  ["#06B6D4","#67E8F9"], ["#6366F1","#818CF8"], ["#14B8A6","#2DD4BF"],
]

export const AVAIL_STYLE = {
  free:    { bg:"#F0FDF4", color:"#15803D" },
  partial: { bg:"#FFFBEB", color:"#D97706" },
  busy:    { bg:"#FEF2F2", color:"#DC2626" },
} as const

export const JOB_COLORS: Record<string, [string,string]> = {
  Cucina:  ["#0095F6","#00C6FF"],
  Bagno:   ["#8B5CF6","#D946EF"],
  Living:  ["#10B981","#34D399"],
  Camera:  ["#F59E0B","#FCD34D"],
  Armadio: ["#EF4444","#F97316"],
  Ufficio: ["#64748B","#94A3B8"],
}

export const SPEC_OPTIONS  = ["Cucine","Bagni","Living","Camere","Armadi","Uffici","Contract"]
export const ZONE_OPTIONS  = ["Modena","Bologna","Reggio Emilia","Ferrara","Carpi","Sassuolo",
                              "Parma","Firenze","Milano","Roma","Napoli","Venezia","Torino"]
export const VAN_SIZES     = ["piccolo","medio","grande"] as const
