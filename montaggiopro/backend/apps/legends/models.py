from django.db import models
from colorfield.fields import ColorField

from . import manages
from ..accounts import fields


class Legend(models.Model):
    objects = manages.Legend()

    name = fields.TitleCharField(max_length=64, unique=True)
    color = ColorField(format="hex", unique=True, null=True, blank=True)

    def __str__(self):
        return self.name
