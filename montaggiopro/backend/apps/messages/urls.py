from rest_framework.routers import SimpleRouter

from . import views

app_name = "messages"

router = SimpleRouter()
router.register(r"", views.ConversationViewSet, basename="conversation")

urlpatterns = router.urls
