from django.contrib import admin

from import_export.admin import ImportExportModelAdmin

from . import models


@admin.register(models.Subsection)
class SubsectionAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
