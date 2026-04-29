from django.db import models
from django.utils.translation import gettext_lazy as _

from . import manages
from ..accounts import fields


class City(models.Model):
    objects = manages.City()

    name = fields.TitleCharField(max_length=64, unique=True)

    class Meta:
        verbose_name = _("City")
        verbose_name_plural = _("Cities")

    def __str__(self):
        return self.name
