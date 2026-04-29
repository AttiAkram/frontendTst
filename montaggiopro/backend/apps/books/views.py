from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.viewsets import ModelViewSet

from . import serializers, models, filters


class Book(ModelViewSet):
    queryset = models.Book.objects.order_by('title')
    serializer_class = serializers.Book
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filterset_class = filters.Book
