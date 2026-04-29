// ─────────────────────────────────────────────────────────
// Backend: Django 4.2 + DRF (BetaModena)
// Dev:  http://api.localhost  (Docker Compose)
// Prod: https://api.tuodominio.com
//
// Auth: JWT Bearer token (header) +
//       Session cookie (CORS credentials) +
//       CSRF token (X-CSRFToken header su POST/PUT/DELETE)
// ─────────────────────────────────────────────────────────

export const API_BASE         = import.meta.env.VITE_API_BASE ?? "http://api.localhost"
export const TOKEN_KEY        = "mp_access"
export const REFRESH_KEY      = "mp_refresh"

export const EP = {
  // ── Auth — endpoint reali ─────────────────────────────
  login:           "/accounts/auth",          // POST { email, password }
  logout:          "/accounts/auth",          // DELETE
  register:        "/accounts/create",        // POST { email, password, first_name, last_name, birthday, sex }
  confirmEmail:    "/accounts/confirm",       // POST { uid, token }
  forgotPassword:  "/accounts/reset-password",// POST { email }
  resetPassword:   "/accounts/reset-password",// PUT  { uid, token, password }
  refreshToken:    "/accounts/token/refresh", // POST { refresh }
  me:              "/accounts/me",            // GET | PUT | DELETE
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

  // ── API MontaggioPro — da implementare nel backend ────
  // I modelli Django sono già stati creati (scaffold in /backend/apps/)
  // Questi endpoint usano dati mock finché le view non sono attive
  teams:              "/teams",
  team:        (id: number) => `/teams/${id}`,
  followTeam:  (id: number) => `/teams/${id}/follow`,
  teamPosts:   (id: number) => `/teams/${id}/posts`,
  teamReviews: (id: number) => `/teams/${id}/reviews`,
  teamAvail:   (id: number) => `/teams/${id}/availability`,

  feed:               "/feed",
  likePost:    (id: number) => `/posts/${id}/like`,
  savePost:    (id: number) => `/posts/${id}/save`,

  jobs:               "/jobs",
  job:         (id: number) => `/jobs/${id}`,
  applyJob:    (id: number) => `/jobs/${id}/apply`,
  myJobs:             "/me/jobs",

  conversations:          "/conversations",
  conversation:  (id: number) => `/conversations/${id}`,
  sendMessage:   (id: number) => `/conversations/${id}/messages`,

  myAvailability:      "/me/availability",
  updateAvailability:  "/me/availability",
  notifSettings:       "/me/settings/notifications",
  privacySettings:     "/me/settings/privacy",
} as const
