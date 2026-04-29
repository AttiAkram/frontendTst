from rest_framework.routers import SimpleRouter

from . import views

app_name = "subsections"

router = SimpleRouter()

router.register(r"", views.Subsection, basename="subsection")

urlpatterns = router.urls
