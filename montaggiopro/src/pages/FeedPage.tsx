import { StoryReel } from "../features/StoryReel"
import { PostCard } from "../features/PostCard"
import { FeedRightSidebar } from "../layouts/FeedRightSidebar"
import { useBreakpoint } from "../hooks/useBreakpoint"
import { TEAMS, POSTS } from "../data/mock"
import type { Profile, Team } from "../types"

interface Props { profile: Profile; onTeamClick: (t: Team) => void }

export function FeedPage({ profile, onTeamClick }: Props) {
  const bp = useBreakpoint()
  const content = (
    <div style={{ flex: 1, maxWidth: 600 }}>
      <StoryReel teams={TEAMS} />
      {POSTS.map((p, i) => <PostCard key={p.id} post={p} delay={i * 100} />)}
    </div>
  )

  if (bp === "wide") {
    return (
      <div style={{ display: "flex", maxWidth: 920, margin: "0 auto", padding: 16 }}>
        {content}
        <FeedRightSidebar profile={profile} onTeamClick={onTeamClick} />
      </div>
    )
  }

  return <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>{content}</div>
}
