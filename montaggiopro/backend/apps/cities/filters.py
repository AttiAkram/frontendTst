import django_filters

from . import models


class City(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = models.City
        fields = ['name']
