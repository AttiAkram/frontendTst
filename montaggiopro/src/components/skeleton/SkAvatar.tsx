import { C } from "../../tokens"

export function SkAvatar({ size = 36 }: { size?: number }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: C.border }} />
}
