from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class City(ModelViewSet):
    queryset = models.City.objects.order_by('name')
    serializer_class = serializers.City
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.City
    pagination_class = None
