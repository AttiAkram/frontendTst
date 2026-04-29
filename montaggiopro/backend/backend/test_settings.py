# Settings for test environment and can be used for dev environment
from split_settings.tools import include

include('settings.py')

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

DEBUG = True

CELERY_TASK_ALWAYS_EAGER = True
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

from .components.DRF.settings import REST_FRAMEWORK

del REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"]
del REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]
