from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class Subsection(ModelViewSet):
    queryset = models.Subsection.objects.order_by('name')
    serializer_class = serializers.Subsection
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.Subsection
    pagination_class = None
