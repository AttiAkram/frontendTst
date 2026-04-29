export const API_BASE         = import.meta.env.VITE_API_BASE ?? "http://api.localhost"
export const TOKEN_KEY        = "mp_access"
export const REFRESH_KEY      = "mp_refresh"

export const EP = {
  // ── Auth ──────────────────────────────────────────────
  login:           "/accounts/auth",
  logout:          "/accounts/auth",
  register:        "/accounts/create",
  confirmEmail:    "/accounts/confirm",
  forgotPassword:  "/accounts/reset-password",
  resetPassword:   "/accounts/reset-password",
  refreshToken:    "/accounts/token/refresh",
  me:              "/accounts/me",
  socialAuth: (backend: string) => `/accounts/auth/${backend}`,

  // ── Risorse esistenti (DRF SimpleRouter) ─────────────
  authors:      "/authors",
  author:       (id: number) => `/authors/${id}`,
  books:        "/books",
  book:         (id: number) => `/books/${id}`,
  categories:   "/categories",
  cities:       "/cities",
  legends:      "/legends",
  subsections:  "/subsections",

  // ── Teams ─────────────────────────────────────────────
  teams:              "/teams",
  team:        (id: number) => `/teams/${id}`,
  followTeam:  (id: number) => `/teams/${id}/follow`,
  teamPosts:   (id: number) => `/teams/${id}/posts`,
  teamReviews: (id: number) => `/teams/${id}/reviews`,
  teamAvail:   (id: number) => `/teams/${id}/availability`,

  // ── Feed (Posts) ──────────────────────────────────────
  feed:               "/feed",
  likePost:    (id: number) => `/feed/${id}/like`,
  savePost:    (id: number) => `/feed/${id}/save`,
  postComments:(id: number) => `/feed/${id}/comments`,

  // ── Jobs ──────────────────────────────────────────────
  jobs:               "/jobs",
  job:         (id: number) => `/jobs/${id}`,
  applyJob:    (id: number) => `/jobs/${id}/apply`,
  myJobs:             "/jobs/mine",

  // ── Reviews ───────────────────────────────────────────
  reviews:            "/reviews",
  review:      (id: number) => `/reviews/${id}`,

  // ── Conversations / Messages ──────────────────────────
  conversations:          "/conversations",
  conversation:  (id: number) => `/conversations/${id}`,
  sendMessage:   (id: number) => `/conversations/${id}/messages`,
} as const
