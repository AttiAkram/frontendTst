import django_filters

from . import models


class Subsection(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = models.Subsection
        fields = ['name']
