import django_filters

from . import models


class Book(django_filters.FilterSet):

    class Meta:
        model = models.Book
        fields = ["title", "author__name", "category", "publisher", "notes", "year", "city__name"]
