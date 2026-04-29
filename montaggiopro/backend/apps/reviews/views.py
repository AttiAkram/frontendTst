from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class ReviewViewSet(ModelViewSet):
    queryset = models.Review.objects.select_related("team").order_by("-created_at")
    serializer_class = serializers.ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ["team"]
