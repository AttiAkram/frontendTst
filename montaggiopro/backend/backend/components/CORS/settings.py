from corsheaders.defaults import default_headers

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True


CORS_ALLOW_HEADERS = (
    *default_headers,
    "cookie",
    "set-cookie"
)
