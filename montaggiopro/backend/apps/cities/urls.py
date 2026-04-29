from rest_framework.routers import SimpleRouter

from . import views

app_name = "cities"

router = SimpleRouter()

router.register(r"", views.City, basename="city")

urlpatterns = router.urls
