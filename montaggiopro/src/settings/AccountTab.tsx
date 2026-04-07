import { useState } from "react"
import { Input } from "../components/Input"
import { FormGrid } from "../components/FormGrid"
import { SettingsSection } from "../components/SettingsSection"
import { Btn } from "../components/Btn"
import { Divider } from "../components/Divider"

export function AccountTab() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")

  return (
    <div>
      <SettingsSection title="Informazioni account">
        <FormGrid>
          <Input label="Email" value="info@fratellirossi.it" onChange={() => {}} placeholder="Email" />
          <Input label="Telefono" value="+39 059 123456" onChange={() => {}} placeholder="Telefono" />
        </FormGrid>
      </SettingsSection>
      <Divider my={16} />
      <SettingsSection title="Cambio password">
        <Input label="Password attuale" value={currentPw} onChange={setCurrentPw} type="password" />
        <FormGrid>
          <Input label="Nuova password" value={newPw} onChange={setNewPw} type="password" />
          <Input label="Conferma password" value={confirmPw} onChange={setConfirmPw} type="password" />
        </FormGrid>
        <Btn variant="secondary">Aggiorna password</Btn>
      </SettingsSection>
      <Divider my={16} />
      <SettingsSection title="Zona pericolosa" description="Questa azione è irreversibile">
        <Btn variant="danger">Elimina account</Btn>
      </SettingsSection>
    </div>
  )
}
