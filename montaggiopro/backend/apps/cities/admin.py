from django.contrib import admin

from import_export.admin import ImportExportModelAdmin

from . import models


@admin.register(models.City)
class CityAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
