from django.contrib import admin

from import_export.admin import ImportExportModelAdmin

from . import models


@admin.register(models.Author)
class AuthorAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
