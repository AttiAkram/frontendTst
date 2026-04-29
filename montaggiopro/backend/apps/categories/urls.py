from rest_framework.routers import SimpleRouter

from . import views

app_name = "categories"

router = SimpleRouter()

router.register(r"", views.Category, basename="category")

urlpatterns = router.urls
