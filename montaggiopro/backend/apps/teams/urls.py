from rest_framework.routers import SimpleRouter

from . import views

app_name = "teams"

router = SimpleRouter()
router.register(r"", views.TeamViewSet, basename="team")

urlpatterns = router.urls
