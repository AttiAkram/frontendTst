import { AvatarPicker } from "../components/AvatarPicker"
import { Input } from "../components/Input"
import { MultiChip } from "../components/MultiChip"
import { Toggle } from "../components/Toggle"
import { FormGrid, FullRow } from "../components/FormGrid"
import { SettingsSection } from "../components/SettingsSection"
import { C, SPEC_OPTIONS, ZONE_OPTIONS, VAN_SIZES } from "../tokens"
import type { Profile, VanSize } from "../types"

interface Props { form: Profile; update: (key: string, val: unknown) => void }

export function ProfileTab({ form, update }: Props) {
  return (
    <div>
      <AvatarPicker colors={form.colors} char={form.char} onChange={c => update("colors", c)} />
      <FormGrid>
        <Input label="Nome squadra" value={form.name} onChange={v => update("name", v)} />
        <Input label="Iniziale avatar" value={form.char} onChange={v => update("char", v.slice(0, 1).toUpperCase())} />
        <Input label="Nome leader" value={form.leader} onChange={v => update("leader", v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input label="Membri" value={String(form.members)} onChange={v => update("members", Number(v) || 0)} />
          <Input label="Anni esp." value={String(form.experience)} onChange={v => update("experience", Number(v) || 0)} />
        </div>
        <FullRow><Input label="Bio" value={form.bio} onChange={v => update("bio", v)} multiline /></FullRow>
        <FullRow><MultiChip label="Specializzazioni" options={SPEC_OPTIONS} selected={form.specs} onChange={v => update("specs", v)} /></FullRow>
        <FullRow><MultiChip label="Zone operative" options={ZONE_OPTIONS} selected={form.zones} onChange={v => update("zones", v)} /></FullRow>
      </FormGrid>
      <SettingsSection title="Attrezzatura" description="Furgone e strumenti disponibili">
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {VAN_SIZES.map(s => (
            <button key={s} onClick={() => update("equipment", { ...form.equipment, van: s as VanSize })} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 500,
              fontFamily: C.font, cursor: "pointer",
              border: `1px solid ${form.equipment.van === s ? C.text : C.border}`,
              background: form.equipment.van === s ? C.text : C.white,
              color: form.equipment.van === s ? C.white : C.text,
              transition: "all 150ms",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <Toggle label="Scala motorizzata" checked={form.equipment.scalaMot}
          onChange={v => update("equipment", { ...form.equipment, scalaMot: v })} />
        <Toggle label="Argano" checked={form.equipment.argano}
          onChange={v => update("equipment", { ...form.equipment, argano: v })} />
      </SettingsSection>
    </div>
  )
}
