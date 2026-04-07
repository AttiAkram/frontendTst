import { useState } from "react"
import { User, Shield, Bell, Lock } from "lucide-react"
import { ProfileTab } from "../settings/ProfileTab"
import { AccountTab } from "../settings/AccountTab"
import { NotificationsTab } from "../settings/NotificationsTab"
import { PrivacyTab } from "../settings/PrivacyTab"
import { Btn } from "../components/Btn"
import { Toast } from "../components/Toast"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { C } from "../tokens"
import type { Profile, NotifPrefs, PrivacyPrefs } from "../types"
import type { LucideIcon } from "lucide-react"

interface Props { profile: Profile; updateProfile: (p: Profile) => void }

type TabKey = "profilo" | "account" | "notifiche" | "privacy"
const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "profilo", label: "Profilo", icon: User },
  { key: "account", label: "Account", icon: Shield },
  { key: "notifiche", label: "Notifiche", icon: Bell },
  { key: "privacy", label: "Privacy", icon: Lock },
]

export function SettingsPage({ profile, updateProfile }: Props) {
  const bp = useBreakpoint()
  const [tab, setTab] = useState<TabKey>("profilo")
  const [form, setForm] = useState<Profile>({ ...profile })
  const [notif, setNotif] = useState<NotifPrefs>(profile.notifPrefs ?? {
    nuoviLavori: true, messaggi: true, recensioni: true, aggiornamenti: false, newsletter: false,
  })
  const [privacy, setPrivacy] = useState<PrivacyPrefs>(profile.privacyPrefs ?? {
    profiloPubblico: true, mostraDisp: true, mostraStats: true, messaggiDa: "tutti",
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)

  const updateForm = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))
  const updateNotif = (key: keyof NotifPrefs, val: boolean) => setNotif(n => ({ ...n, [key]: val }))
  const updatePrivacy = (key: keyof PrivacyPrefs, val: boolean | string) => setPrivacy(p => ({ ...p, [key]: val }))

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      updateProfile({ ...form, notifPrefs: notif, privacyPrefs: privacy })
      setSaving(false)
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    }, 600)
  }

  const cancel = () => {
    setForm({ ...profile })
    setNotif(profile.notifPrefs ?? { nuoviLavori: true, messaggi: true, recensioni: true, aggiornamenti: false, newsletter: false })
    setPrivacy(profile.privacyPrefs ?? { profiloPubblico: true, mostraDisp: true, mostraStats: true, messaggiDa: "tutti" })
  }

  const tabNav = (
    <div style={bp === "mobile"
      ? { display: "flex", gap: 4, overflowX: "auto", marginBottom: 16, padding: "4px 0" }
      : { width: 200, flexShrink: 0 }
    }>
      {TABS.map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{
          display: "flex", alignItems: "center", gap: 8, width: bp === "mobile" ? undefined : "100%",
          padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: tab === t.key ? 600 : 400, fontFamily: C.font,
          color: tab === t.key ? C.accent : C.text,
          background: tab === t.key ? "#F0F9FF" : "transparent",
          whiteSpace: "nowrap", transition: "all 200ms",
        }}>
          <t.icon size={16} /> {t.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: C.font, marginBottom: 20 }}>Impostazioni</div>
      <div style={bp === "mobile" ? {} : { display: "flex", gap: 24 }}>
        {tabNav}
        <div style={{ flex: 1, background: C.white, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          {tab === "profilo" && <ProfileTab form={form} update={updateForm} />}
          {tab === "account" && <AccountTab />}
          {tab === "notifiche" && <NotificationsTab form={notif} update={updateNotif} />}
          {tab === "privacy" && <PrivacyTab form={privacy} update={updatePrivacy} />}
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={cancel}>Annulla</Btn>
            <Btn onClick={save} loading={saving}>Salva modifiche</Btn>
          </div>
        </div>
      </div>
      <Toast message="Profilo aggiornato!" visible={toast} />
    </div>
  )
}
