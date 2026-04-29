from rest_framework.routers import SimpleRouter

from . import views

app_name = "books"

router = SimpleRouter()

router.register(r"", views.Book, basename="book")

urlpatterns = router.urls
