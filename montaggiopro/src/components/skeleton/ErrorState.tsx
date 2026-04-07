import { AlertCircle } from "lucide-react"
import { C } from "../../tokens"
import { Btn } from "../Btn"

interface Props { message: string; onRetry?: () => void }

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <AlertCircle size={40} color={C.sub} style={{ opacity: 0.5, marginBottom: 12 }} />
      <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 4 }}>Errore</div>
      <div style={{ fontSize: 14, color: C.sub, fontFamily: C.font, marginBottom: 16 }}>{message}</div>
      {onRetry && <Btn onClick={onRetry}>Riprova</Btn>}
    </div>
  )
}
