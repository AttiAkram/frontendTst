from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class Author(ModelViewSet):
    queryset = models.Author.objects.order_by('name')
    serializer_class = serializers.Author
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.Author
    pagination_class = None
