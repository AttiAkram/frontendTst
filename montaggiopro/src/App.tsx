import { useState, useCallback } from "react"
import { PlusSquare, List } from "lucide-react"
import { AuthProvider } from "./context/AuthCtx"
import { ProfileCtx } from "./context/ProfileCtx"
import { RoleCtx } from "./context/RoleCtx"
import { useBreakpoint } from "./hooks/useBreakpoint"
import { Sidebar } from "./nav/Sidebar"
import { BottomNav } from "./nav/BottomNav"
import { MobileHeader } from "./nav/MobileHeader"
import { FeedPage } from "./pages/FeedPage"
import { JobBoardPage } from "./pages/JobBoardPage"
import { SearchPage } from "./pages/SearchPage"
import { CalendarPage } from "./pages/CalendarPage"
import { MessagesPage } from "./pages/MessagesPage"
import { TeamProfilePage } from "./pages/TeamProfilePage"
import { SettingsPage } from "./pages/SettingsPage"
import { PlaceholderPage } from "./pages/PlaceholderPage"
import { TEAMS } from "./data/mock"
import type { Role, Team, Profile } from "./types"

function AppInner() {
  const bp = useBreakpoint()
  const [role, setRole] = useState<Role>("squadra")
  const [page, setPage] = useState("feed")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [profile, setProfile] = useState<Profile>(TEAMS[0] as Profile)

  const switchRole = useCallback((r: Role) => {
    setRole(r)
    setPage(r === "squadra" ? "feed" : "search")
    setSelectedTeam(null)
  }, [])

  const openTeam = useCallback((t: Team) => {
    setSelectedTeam(t)
    setPage("teamProfile")
  }, [])

  const goBack = useCallback(() => {
    setSelectedTeam(null)
    setPage(role === "squadra" ? "feed" : "search")
  }, [role])

  const renderPage = () => {
    switch (page) {
      case "feed":        return <FeedPage profile={profile} onTeamClick={openTeam} />
      case "bacheca":     return <JobBoardPage />
      case "calendar":    return <CalendarPage profile={profile} updateProfile={setProfile} />
      case "messages":    return <MessagesPage />
      case "profile":     return <TeamProfilePage team={profile} onSettings={() => setPage("settings")} />
      case "teamProfile": return <TeamProfilePage team={selectedTeam ?? undefined} onBack={goBack} />
      case "settings":    return <SettingsPage profile={profile} updateProfile={setProfile} />
      case "search":      return <SearchPage onTeamClick={openTeam} />
      case "post":        return <PlaceholderPage label="Pubblica annuncio" icon={PlusSquare} />
      case "listings":    return <PlaceholderPage label="I miei annunci" icon={List} />
      default:            return <FeedPage profile={profile} onTeamClick={openTeam} />
    }
  }

  return (
    <RoleCtx.Provider value={{ role, setRole: switchRole }}>
      <ProfileCtx.Provider value={{ profile, updateProfile: setProfile }}>
        {bp === "mobile" ? (
          <>
            <MobileHeader role={role} onToggle={switchRole} page={page} onPage={setPage} />
            <main style={{ paddingBottom: 56 }}>{renderPage()}</main>
            <BottomNav page={page} onPage={setPage} role={role} />
          </>
        ) : (
          <>
            <Sidebar page={page} onPage={setPage} role={role} onToggle={switchRole} />
            <main style={{ marginLeft: 220, minHeight: "100vh" }}>{renderPage()}</main>
          </>
        )}
      </ProfileCtx.Provider>
    </RoleCtx.Provider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
