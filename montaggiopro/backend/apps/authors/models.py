from django.db import models

from . import manages
from ..accounts import fields


class Author(models.Model):
    objects = manages.Author()

    name = fields.TitleCharField(max_length=64, unique=True)

    def __str__(self):
        return self.name
