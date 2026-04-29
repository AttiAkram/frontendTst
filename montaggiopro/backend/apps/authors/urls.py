from rest_framework.routers import SimpleRouter

from . import views

app_name = "authors"

router = SimpleRouter()

router.register(r"", views.Author, basename="author")

urlpatterns = router.urls
