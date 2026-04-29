import { Team, Post, Job, Review, Conversation, ChatMessage, Profile } from "../types"

// ─── Disponibilità demo ───────────────────────────────────
export const AVAIL_DEMO: Record<number, "free" | "partial" | "busy"> = {
  1:"free",2:"free",3:"busy",4:"busy",5:"free",6:"free",
  7:"partial",8:"partial",9:"free",10:"free",11:"busy",12:"free",
  13:"free",14:"free",15:"partial",16:"free",17:"free",18:"busy",
  19:"busy",20:"free",21:"free",22:"free",23:"partial",24:"free",
  25:"free",26:"free",27:"free",28:"busy",29:"free",30:"partial",
}

// ─── Squadre ──────────────────────────────────────────────
export const TEAMS: Team[] = [
  { id:1, name:"Fratelli Rossi Montaggi", leader:"Marco Rossi",    char:"R", colors:["#0095F6","#00C6FF"], members:3, experience:8,  rating:4.9, reviews:127, jobs:312, verified:true,  zones:["Modena","Bologna","Reggio Emilia"], specs:["Cucine","Bagni","Living"],                    equipment:{ van:"grande", vanM3:18, scalaMot:true,  argano:false }, bio:"Specializzati in cucine su misura e bagni completi. 8 anni con i principali brand italiani.", availability:AVAIL_DEMO },
  { id:2, name:"Team Pro Arredo Milano",   leader:"Luca Ferrari",   char:"P", colors:["#8B5CF6","#D946EF"], members:4, experience:12, rating:4.8, reviews:203, jobs:541, verified:true,  zones:["Milano","Monza","Lecco"],           specs:["Cucine","Living","Camere","Contract"],         equipment:{ van:"grande", vanM3:22, scalaMot:true,  argano:true  }, bio:"12 anni nel contract e nel residenziale di lusso. Disponibili tutto il nord Italia.", availability:AVAIL_DEMO },
  { id:3, name:"Montaggio Express Roma",   leader:"Antonio Belli",  char:"E", colors:["#10B981","#34D399"], members:2, experience:5,  rating:4.6, reviews:89,  jobs:178, verified:false, zones:["Roma","Frosinone","Latina"],        specs:["Cucine","Armadi"],                            equipment:{ van:"medio",  vanM3:12, scalaMot:false, argano:false }, bio:"Squadra agile su Roma e provincia. Tempi rapidi e prezzi competitivi.", availability:AVAIL_DEMO },
  { id:4, name:"Arredo & Montaggio Srl",   leader:"Sara Conti",     char:"A", colors:["#F59E0B","#FCD34D"], members:5, experience:15, rating:5.0, reviews:341, jobs:892, verified:true,  zones:["Firenze","Prato","Pistoia"],        specs:["Cucine","Bagni","Living","Camere","Contract"],equipment:{ van:"grande", vanM3:20, scalaMot:true,  argano:true  }, bio:"La squadra più completa della Toscana. 15 anni con Scavolini, Modulnova e Valcucine.", availability:AVAIL_DEMO },
  { id:5, name:"Nord Est Montaggi",        leader:"Ivan Slavic",    char:"N", colors:["#EF4444","#F97316"], members:3, experience:7,  rating:4.7, reviews:112, jobs:267, verified:true,  zones:["Venezia","Padova","Treviso"],       specs:["Cucine","Bagni","Uffici"],                    equipment:{ van:"medio",  vanM3:14, scalaMot:false, argano:true  }, bio:"Specializzati nel triveneto. Forti su uffici e contract.", availability:AVAIL_DEMO },
  { id:6, name:"Sud Montaggio Team",       leader:"Giuseppe Russo", char:"S", colors:["#EC4899","#FB7185"], members:2, experience:4,  rating:4.4, reviews:56,  jobs:134, verified:false, zones:["Napoli","Caserta","Salerno"],       specs:["Cucine","Armadi","Camere"],                   equipment:{ van:"piccolo",vanM3:8,  scalaMot:false, argano:false }, bio:"Squadra agile su Napoli e provincia. Specializzati in piccoli appartamenti.", availability:AVAIL_DEMO },
]

export const MY_PROFILE: Profile = { ...TEAMS[0] }

// ─── Post ─────────────────────────────────────────────────
export const POSTS: Post[] = [
  { id:1, team:TEAMS[0], city:"Modena",  time:"2h", likes:312, comments:18, caption:"Cucina Scavolini Liberamente completata in 5h. Cliente soddisfatto al 100%.",  tags:["cucina","scavolini","modena"]  },
  { id:2, team:TEAMS[1], city:"Milano",  time:"5h", likes:489, comments:34, caption:"Contract 12 appartamenti a Milano. Team al completo, zero imprevisti.",         tags:["contract","living","milano"]   },
  { id:3, team:TEAMS[3], city:"Firenze", time:"1g", likes:721, comments:61, caption:"Bagno Modulnova. Ogni dettaglio conta.",                                         tags:["bagno","modulnova","firenze"]  },
  { id:4, team:TEAMS[2], city:"Roma",    time:"2g", likes:198, comments:11, caption:"Armadio piano 4 senza ascensore. Missione compiuta.",                            tags:["armadio","roma","sfida"]       },
  { id:5, team:TEAMS[4], city:"Venezia", time:"3g", likes:267, comments:22, caption:"Ufficio direzionale Padova. Cucina Valcucine + living completo.",                tags:["ufficio","contract","padova"]  },
]

// ─── Lavori ───────────────────────────────────────────────
export const JOBS: Job[] = [
  { id:1, store:{ name:"Cucine Bertolini",     char:"B", colors:["#0095F6","#00C6FF"] }, type:"Cucina",  city:"Modena",    province:"MO", date:"20 apr", budget:350, floor:"Piano 3 + ascensore",    colli:8,  scalaMot:false, argano:false, description:"Cucina Scavolini lineare 4m. Accesso normale, parcheggio in loco.", applied:false },
  { id:2, store:{ name:"Arredo Casa Bologna",  char:"A", colors:["#8B5CF6","#D946EF"] }, type:"Bagno",   city:"Bologna",   province:"BO", date:"22 apr", budget:420, floor:"Piano 1",                colli:12, scalaMot:false, argano:false, description:"Bagno completo Modulnova. Inclusi sanitari e rubinetteria.",        applied:true  },
  { id:3, store:{ name:"Living Design Milano", char:"L", colors:["#10B981","#34D399"] }, type:"Living",  city:"Milano",    province:"MI", date:"25 apr", budget:680, floor:"Piano 5 senza ascensore", colli:22, scalaMot:true,  argano:false, description:"Living Poliform. Scala stretta, richiesta scala motorizzata.",       applied:false },
  { id:4, store:{ name:"Camere & Sogni",       char:"C", colors:["#F59E0B","#FCD34D"] }, type:"Camera",  city:"Ferrara",   province:"FE", date:"28 apr", budget:280, floor:"Piano 2 + ascensore",    colli:6,  scalaMot:false, argano:false, description:"Camera Lema. Armadio 4 ante e letto contenitore.",                  applied:false },
  { id:5, store:{ name:"Uffici & Spazi",       char:"U", colors:["#EF4444","#F97316"] }, type:"Ufficio", city:"Reggio E.", province:"RE", date:"3 mag",  budget:900, floor:"Piano 1",                colli:35, scalaMot:false, argano:false, description:"Ufficio completo 300mq. Scrivanie, archivi, sala riunioni.",        applied:false },
  { id:6, store:{ name:"Cucine Carpi",         char:"K", colors:["#EC4899","#FB7185"] }, type:"Cucina",  city:"Carpi",     province:"MO", date:"5 mag",  budget:310, floor:"Piano 2 + ascensore",    colli:7,  scalaMot:false, argano:false, description:"Cucina Veneta Cucine angolare. Installazione cappa e piano cottura.",applied:false },
]

// ─── Recensioni ───────────────────────────────────────────
export const REVIEWS: Review[] = [
  { id:1, store:{ name:"Cucine Bertolini",   char:"B", colors:["#0095F6","#00C6FF"] }, rating:5.0, date:"15 mar 2026", text:"Ottimo lavoro! Cucina montata in meno di 4 ore, precisi e puliti. Cliente entusiasta.",   tags:["Puntuali","Professionali","Puliti"] },
  { id:2, store:{ name:"Arredo Casa Modena", char:"A", colors:["#8B5CF6","#D946EF"] }, rating:4.8, date:"2 mar 2026",  text:"Bagno completato nonostante difficoltà di accesso. Hanno risolto tutto autonomamente.",     tags:["Autonomi","Esperti","Precisi"]      },
  { id:3, store:{ name:"Living Design BO",   char:"L", colors:["#10B981","#34D399"] }, rating:5.0, date:"18 feb 2026", text:"Terza volta, sempre al top. Furgone grande, scala motorizzata propria, zero problemi.",    tags:["Affidabili","Equipaggiati"]         },
]

// ─── Messaggi ─────────────────────────────────────────────
export const CONVS: Conversation[] = TEAMS.slice(0,4).map((t, i) => ({
  id:     t.id,
  name:   t.name,
  char:   t.char,
  colors: t.colors,
  last:   ["Perfetto, ci vediamo lunedì","Avete il furgone grande?","Mandate preventivo","Confermato per il 15"][i],
  time:   ["5 min","1h","3h","ieri"][i],
  unread: [2,0,1,0][i],
}))

export const CHAT_MSGS: ChatMessage[] = [
  { id:1, me:true,  text:"Ciao! Siete disponibili il 20 aprile per una cucina a Modena? 8 colli, piano 3 con ascensore." },
  { id:2, me:false, text:"Buongiorno! Sì, abbiamo disponibilità il 20. Che marca è la cucina?" },
  { id:3, me:true,  text:"Scavolini lineare 4m. Budget €350 tutto compreso." },
  { id:4, me:false, text:"Perfetto, mandate l'indirizzo e confermiamo." },
]

// ─── Lavori calendario ────────────────────────────────────
export const CALENDAR_JOBS: Record<number, { id:number; type:string; store:string; city:string; budget:number; colli:number; floor:string; scalaMot:boolean }[]> = {
  3:  [{ id:1,  type:"Cucina",  store:"Cucine Bertolini", city:"Modena",    budget:350, colli:8,  floor:"P.3+asc", scalaMot:false }],
  4:  [{ id:2,  type:"Bagno",   store:"Arredo Bologna",   city:"Bologna",   budget:420, colli:12, floor:"P.1",     scalaMot:false }],
  7:  [{ id:3,  type:"Living",  store:"Living Design MI", city:"Milano",    budget:680, colli:22, floor:"P.5",     scalaMot:true  }],
  11: [{ id:4,  type:"Armadio", store:"Camere & Sogni",   city:"Ferrara",   budget:280, colli:6,  floor:"P.2+asc", scalaMot:false }],
  15: [{ id:5,  type:"Cucina",  store:"Cucine Carpi",     city:"Carpi",     budget:310, colli:7,  floor:"P.2+asc", scalaMot:false },
       { id:6,  type:"Bagno",   store:"Arredo Sassuolo",  city:"Sassuolo",  budget:290, colli:9,  floor:"P.1",     scalaMot:false }],
  18: [{ id:7,  type:"Ufficio", store:"Uffici & Spazi",   city:"Reggio E.", budget:900, colli:35, floor:"P.1",     scalaMot:false }],
  19: [{ id:8,  type:"Camera",  store:"Casa Moderna MO",  city:"Modena",    budget:240, colli:5,  floor:"P.4+asc", scalaMot:false }],
  23: [{ id:9,  type:"Bagno",   store:"Arredo Ferrara",   city:"Ferrara",   budget:380, colli:10, floor:"P.2",     scalaMot:false }],
  28: [{ id:10, type:"Cucina",  store:"Scavolini Center", city:"Bologna",   budget:520, colli:14, floor:"P.1",     scalaMot:false }],
}
