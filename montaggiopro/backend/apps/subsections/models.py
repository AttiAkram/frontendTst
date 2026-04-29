from django.db import models

from . import manages

from ..legends.models import Legend
from ..accounts import fields


class Subsection(models.Model):
    objects = manages.Subsection()

    name = fields.TitleCharField(max_length=128, unique=True)
    legend = models.ForeignKey(Legend, related_name="subsections", on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self):
        return self.name
