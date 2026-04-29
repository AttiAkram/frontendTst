from django.db import models
from django.utils.translation import gettext_lazy as _

from . import manages
from ..accounts import fields


class Category(models.Model):
    objects = manages.Category()

    name = fields.TitleCharField(max_length=128, unique=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name
