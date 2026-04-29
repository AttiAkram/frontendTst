from django.contrib import admin

from import_export.admin import ImportExportModelAdmin

from . import models


@admin.register(models.Book)
class BookAdmin(ImportExportModelAdmin):
    search_fields = ("title", "author__name", "category", "city__name", "year", "notes")
