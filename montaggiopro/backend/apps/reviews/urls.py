from rest_framework.routers import SimpleRouter

from . import views

app_name = "reviews"

router = SimpleRouter()
router.register(r"", views.ReviewViewSet, basename="review")

urlpatterns = router.urls
