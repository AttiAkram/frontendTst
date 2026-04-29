from rest_framework.routers import SimpleRouter

from . import views

app_name = "jobs"

router = SimpleRouter()
router.register(r"", views.JobViewSet, basename="job")

urlpatterns = router.urls
