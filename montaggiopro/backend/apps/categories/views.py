from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class Category(ModelViewSet):
    queryset = models.Category.objects.order_by('name')
    serializer_class = serializers.Category
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.Category
    pagination_class = None
