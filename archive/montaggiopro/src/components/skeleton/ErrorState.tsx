import { AlertCircle } from "lucide-react"
import { C } from "../../tokens"
import { Btn } from "../Btn"

interface Props { message: string; onRetry?: () => void }

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <AlertCircle size={32} color={C.sub} style={{ opacity: 0.4, marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 4 }}>Errore</div>
      <div style={{ fontSize: 13, color: C.sub, fontFamily: C.font, marginBottom: 14 }}>{message}</div>
      {onRetry && <Btn onClick={onRetry}>Riprova</Btn>}
    </div>
  )
}
