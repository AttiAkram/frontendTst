from rest_framework.routers import SimpleRouter

from . import views

app_name = "legends"

router = SimpleRouter()

router.register(r"", views.Legend, basename="legend")

urlpatterns = router.urls
