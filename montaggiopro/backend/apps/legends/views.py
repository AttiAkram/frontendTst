from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class Legend(ModelViewSet):
    queryset = models.Legend.objects.order_by('name')
    serializer_class = serializers.Legend
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.Legend
    pagination_class = None
