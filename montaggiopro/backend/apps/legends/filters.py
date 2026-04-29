import django_filters

from . import models


class Legend(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = models.Legend
        fields = ['name']
