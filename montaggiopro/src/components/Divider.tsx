import { C } from "../tokens"

interface Props { my?: number }

export function Divider({ my = 0 }: Props) {
  return <div style={{ height: 1, background: C.border, margin: `${my}px 0` }} />
}
