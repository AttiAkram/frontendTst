from rest_framework.routers import SimpleRouter

from . import views

app_name = "feed"

router = SimpleRouter()
router.register(r"", views.PostViewSet, basename="post")

urlpatterns = router.urls
