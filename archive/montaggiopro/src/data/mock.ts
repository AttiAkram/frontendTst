import type { AvailStatus, Team, Post, Job, Review, Conversation, ChatMessage } from "../types"

export const AVAIL: Record<number, AvailStatus> = (() => {
  const m: Record<number, AvailStatus> = {}
  const statuses: AvailStatus[] = ["free", "partial", "busy"]
  for (let d = 1; d <= 30; d++) {
    m[d] = d % 7 === 0 ? "busy" : d % 3 === 0 ? "partial" : "free"
  }
  return m
})()

export const TEAMS: Team[] = [
  {
    id: 1, name: "Fratelli Rossi Montaggi", leader: "Marco Rossi", char: "F",
    colors: ["#0095F6","#00C6FF"], members: 4, experience: 12, rating: 4.8, reviews: 127, jobs: 340,
    verified: true, zones: ["Modena","Bologna","Reggio Emilia"],
    specs: ["Cucine","Bagni","Living"],
    equipment: { van: "grande", vanM3: 18, scalaMot: true, argano: false },
    bio: "Squadra specializzata nel montaggio cucine e bagni con oltre 12 anni di esperienza nel settore.",
    availability: AVAIL, email: "info@fratellirossi.it", phone: "+39 059 123456",
  },
  {
    id: 2, name: "Team Pro Arredo Milano", leader: "Luca Bianchi", char: "T",
    colors: ["#8B5CF6","#D946EF"], members: 6, experience: 8, rating: 4.6, reviews: 89, jobs: 210,
    verified: true, zones: ["Milano","Monza","Lecco"],
    specs: ["Cucine","Living","Camere","Contract"],
    equipment: { van: "grande", vanM3: 22, scalaMot: true, argano: true },
    bio: "Team professionale per montaggi residenziali e contract. Disponibili anche per grandi cantieri.",
    availability: AVAIL,
  },
  {
    id: 3, name: "Montaggio Express Roma", leader: "Giuseppe Verdi", char: "M",
    colors: ["#10B981","#34D399"], members: 3, experience: 5, rating: 4.4, reviews: 45, jobs: 120,
    verified: false, zones: ["Roma","Frosinone"],
    specs: ["Cucine","Armadi"],
    equipment: { van: "medio", vanM3: 12, scalaMot: false, argano: false },
    bio: "Montaggi rapidi e precisi nella zona di Roma. Specializzati in cucine e armadi su misura.",
    availability: AVAIL,
  },
  {
    id: 4, name: "Arredo & Montaggio Srl", leader: "Andrea Neri", char: "A",
    colors: ["#F59E0B","#FCD34D"], members: 8, experience: 15, rating: 5.0, reviews: 203, jobs: 520,
    verified: true, zones: ["Firenze","Prato"],
    specs: ["Cucine","Bagni","Living","Camere","Armadi","Uffici","Contract"],
    equipment: { van: "grande", vanM3: 20, scalaMot: true, argano: true },
    bio: "La soluzione completa per ogni tipo di montaggio. Qualità certificata e puntualità garantita.",
    availability: AVAIL,
  },
  {
    id: 5, name: "Nord Est Montaggi", leader: "Paolo Zanetti", char: "N",
    colors: ["#06B6D4","#67E8F9"], members: 4, experience: 7, rating: 4.5, reviews: 67, jobs: 180,
    verified: true, zones: ["Venezia","Padova"],
    specs: ["Cucine","Bagni","Uffici"],
    equipment: { van: "medio", vanM3: 14, scalaMot: false, argano: true },
    bio: "Esperti nel montaggio in zone con accesso difficile. Dotati di argano per piani alti senza ascensore.",
    availability: AVAIL,
  },
  {
    id: 6, name: "Sud Montaggio Team", leader: "Antonio Esposito", char: "S",
    colors: ["#EF4444","#F97316"], members: 3, experience: 4, rating: 4.2, reviews: 32, jobs: 85,
    verified: false, zones: ["Napoli","Caserta"],
    specs: ["Cucine","Armadi","Camere"],
    equipment: { van: "piccolo", vanM3: 8, scalaMot: false, argano: false },
    bio: "Giovane squadra motivata e in crescita. Prezzi competitivi e massima disponibilità.",
    availability: AVAIL,
  },
]

export const POSTS: Post[] = [
  { id: 1, team: TEAMS[0], city: "Modena", time: "2h", likes: 47, comments: 5,
    caption: "Cucina Scavolini montata in 6 ore. Cliente soddisfattissimo!", tags: ["cucina","scavolini","modena"] },
  { id: 2, team: TEAMS[1], city: "Milano", time: "5h", likes: 32, comments: 3,
    caption: "Contract hotel 4 stelle: 22 camere completate in 3 giorni.", tags: ["contract","hotel","milano"] },
  { id: 3, team: TEAMS[2], city: "Roma", time: "1g", likes: 19, comments: 2,
    caption: "Armadio scorrevole su misura. Montaggio perfetto al millimetro.", tags: ["armadio","roma"] },
  { id: 4, team: TEAMS[3], city: "Firenze", time: "2g", likes: 58, comments: 8,
    caption: "Progetto completo appartamento: cucina, bagno e living in 2 giorni.", tags: ["cucina","bagno","living"] },
  { id: 5, team: TEAMS[4], city: "Venezia", time: "3g", likes: 24, comments: 4,
    caption: "Montaggio al terzo piano senza ascensore con argano. Nessun problema!", tags: ["argano","venezia"] },
]

export const JOBS: Job[] = [
  { id: 1, store: { name: "MondoCasa Modena", char: "M", colors: ["#0095F6","#00C6FF"] },
    type: "Cucina", city: "Modena", province: "MO", date: "15 Apr 2026", budget: 350,
    floor: "2° piano con ascensore", colli: 18, scalaMot: false, argano: false,
    description: "Montaggio cucina lineare 3.60m con colonna forno e lavastoviglie.", applied: false },
  { id: 2, store: { name: "Bagno Design Bologna", char: "B", colors: ["#8B5CF6","#D946EF"] },
    type: "Bagno", city: "Bologna", province: "BO", date: "18 Apr 2026", budget: 280,
    floor: "Piano terra", colli: 8, scalaMot: false, argano: false,
    description: "Montaggio mobile bagno doppio lavabo + colonna.", applied: false },
  { id: 3, store: { name: "ArredoVivo Milano", char: "A", colors: ["#10B981","#34D399"] },
    type: "Living", city: "Milano", province: "MI", date: "20 Apr 2026", budget: 420,
    floor: "5° piano senza ascensore", colli: 24, scalaMot: true, argano: true,
    description: "Soggiorno completo con libreria a parete e mobile TV.", applied: false },
  { id: 4, store: { name: "CameraFelice Roma", char: "C", colors: ["#F59E0B","#FCD34D"] },
    type: "Camera", city: "Roma", province: "RM", date: "22 Apr 2026", budget: 300,
    floor: "3° piano con ascensore", colli: 14, scalaMot: false, argano: false,
    description: "Camera matrimoniale completa: letto, comodini, como e armadio 2 ante.", applied: false },
  { id: 5, store: { name: "Ufficio Smart Firenze", char: "U", colors: ["#64748B","#94A3B8"] },
    type: "Ufficio", city: "Firenze", province: "FI", date: "25 Apr 2026", budget: 550,
    floor: "Open space piano terra", colli: 30, scalaMot: false, argano: false,
    description: "Postazioni operative x6 con scrivanie regolabili e cassettiere.", applied: false },
  { id: 6, store: { name: "Casa & Stile Napoli", char: "C", colors: ["#EF4444","#F97316"] },
    type: "Armadio", city: "Napoli", province: "NA", date: "28 Apr 2026", budget: 250,
    floor: "4° piano senza ascensore", colli: 12, scalaMot: true, argano: false,
    description: "Armadio scorrevole 3 ante con specchio centrale.", applied: false },
]

export const REVIEWS: Review[] = [
  { id: 1, store: { name: "MondoCasa Modena", char: "M", colors: ["#0095F6","#00C6FF"] },
    rating: 5, date: "10 Mar 2026", text: "Squadra eccezionale, lavoro perfetto e tempi rispettati. Consigliatissimi!",
    tags: ["Puntuali","Precisi","Professionali"] },
  { id: 2, store: { name: "Bagno Design Bologna", char: "B", colors: ["#8B5CF6","#D946EF"] },
    rating: 4, date: "5 Mar 2026", text: "Buon lavoro nel complesso. Piccolo ritardo iniziale ma risultato ottimo.",
    tags: ["Qualità","Esperienza"] },
  { id: 3, store: { name: "ArredoVivo Milano", char: "A", colors: ["#10B981","#34D399"] },
    rating: 5, date: "28 Feb 2026", text: "Montaggio impeccabile anche al quinto piano senza ascensore. Grandissimi!",
    tags: ["Affidabili","Attrezzati","Top"] },
]

export const CONVS: Conversation[] = [
  { id: 1, name: "MondoCasa Modena", char: "M", colors: ["#0095F6","#00C6FF"],
    last: "Perfetto, vi aspettiamo lunedì!", time: "10:30", unread: 2 },
  { id: 2, name: "Bagno Design Bologna", char: "B", colors: ["#8B5CF6","#D946EF"],
    last: "Potete inviarmi il preventivo?", time: "Ieri", unread: 0 },
  { id: 3, name: "ArredoVivo Milano", char: "A", colors: ["#10B981","#34D399"],
    last: "Grazie per il lavoro svolto!", time: "Mar", unread: 0 },
  { id: 4, name: "CameraFelice Roma", char: "C", colors: ["#F59E0B","#FCD34D"],
    last: "Quando sareste disponibili?", time: "Lun", unread: 1 },
]

export const CHAT: ChatMessage[] = [
  { id: 1, text: "Buongiorno, avremmo bisogno di un montaggio cucina per lunedì.", me: false },
  { id: 2, text: "Buongiorno! Certo, di quanti colli si tratta?", me: true },
  { id: 3, text: "18 colli, secondo piano con ascensore.", me: false },
  { id: 4, text: "Perfetto, vi aspettiamo lunedì!", me: false },
]
