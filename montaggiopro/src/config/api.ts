export const API_BASE         = import.meta.env.VITE_API_BASE ?? "https://api.montaggiopro.it/v1"
export const AUTH_STORAGE_KEY = "mp_token"

export const EP = {
  login:              "/auth/login",
  register:           "/auth/register",
  logout:             "/auth/logout",

  myProfile:          "/me/profile",
  updateProfile:      "/me/profile",
  myAvailability:     "/me/availability",
  updateAvailability: "/me/availability",

  feed:               "/feed",
  createPost:         "/posts",
  likePost:    (id: number) => `/posts/${id}/like`,
  savePost:    (id: number) => `/posts/${id}/save`,

  jobs:               "/jobs",
  job:         (id: number) => `/jobs/${id}`,
  applyJob:    (id: number) => `/jobs/${id}/apply`,
  createJob:          "/jobs",
  myJobs:             "/me/jobs",

  teams:              "/teams",
  team:        (id: number) => `/teams/${id}`,
  followTeam:  (id: number) => `/teams/${id}/follow`,
  teamPosts:   (id: number) => `/teams/${id}/posts`,
  teamReviews: (id: number) => `/teams/${id}/reviews`,
  teamAvail:   (id: number) => `/teams/${id}/availability`,

  conversations:          "/conversations",
  conversation:  (id: number) => `/conversations/${id}`,
  sendMessage:   (id: number) => `/conversations/${id}/messages`,

  notifSettings:  "/me/settings/notifications",
  privacySettings:"/me/settings/privacy",
  changePassword: "/me/settings/password",
  deleteAccount:  "/me/account",
} as const
