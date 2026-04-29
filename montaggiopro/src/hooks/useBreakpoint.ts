import { useState, useEffect } from "react"

export type Breakpoint = "mobile" | "tablet" | "desktop"

export function useBreakpoint(): Breakpoint {
  const [w, setW] = useState(() => window.innerWidth)

  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])

  if (w < 600)  return "mobile"
  if (w < 1024) return "tablet"
  return "desktop"
}

export const isMobile  = (bp: Breakpoint) => bp === "mobile"
export const isTablet  = (bp: Breakpoint) => bp === "tablet"
export const isDesktop = (bp: Breakpoint) => bp === "desktop"
