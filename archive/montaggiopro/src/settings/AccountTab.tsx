import { useState } from "react"
import { Input } from "../components/Input"
import { FormGrid } from "../components/FormGrid"
import { SettingsSection } from "../components/SettingsSection"
import { Btn } from "../components/Btn"

export function AccountTab() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")

  return (
    <div>
      <SettingsSection title="Informazioni account">
        <FormGrid>
          <Input label="Email" value="info@fratellirossi.it" onChange={() => {}} />
          <Input label="Telefono" value="+39 059 123456" onChange={() => {}} />
        </FormGrid>
      </SettingsSection>
      <div style={{ height: 1, background: "#E5E5E5", margin: "12px 0" }} />
      <SettingsSection title="Cambio password">
        <Input label="Password attuale" value={currentPw} onChange={setCurrentPw} type="password" />
        <FormGrid>
          <Input label="Nuova password" value={newPw} onChange={setNewPw} type="password" />
          <Input label="Conferma" value={confirmPw} onChange={setConfirmPw} type="password" />
        </FormGrid>
        <Btn variant="secondary">Aggiorna password</Btn>
      </SettingsSection>
      <div style={{ height: 1, background: "#E5E5E5", margin: "12px 0" }} />
      <SettingsSection title="Zona pericolosa" description="Questa azione non può essere annullata">
        <Btn variant="danger">Elimina account</Btn>
      </SettingsSection>
    </div>
  )
}
