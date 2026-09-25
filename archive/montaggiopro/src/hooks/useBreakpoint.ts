import { useState, useEffect } from "react"

type Breakpoint = "mobile" | "desktop" | "wide"

function getBreakpoint(): Breakpoint {
  const w = window.innerWidth
  if (w < 768) return "mobile"
  if (w < 1200) return "desktop"
  return "wide"
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState(getBreakpoint)
  useEffect(() => {
    const handler = () => setBp(getBreakpoint())
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return bp
}
