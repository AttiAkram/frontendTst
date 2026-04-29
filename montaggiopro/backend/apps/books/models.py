from django.db import models

from . import manages
from ..accounts import fields

from ..authors.models import Author
from ..categories.models import Category
from ..cities.models import City
from ..legends.models import Legend
from ..subsections.models import Subsection


class Book(models.Model):
    objects = manages.Book()

    title = fields.TitleCharField(max_length=128)
    author = models.ForeignKey(Author, related_name="books", on_delete=models.DO_NOTHING)

    image = models.ImageField(upload_to="booksImages/", null=True, blank=True)
    book = models.FileField(upload_to="books", null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    publisher = fields.TitleCharField(max_length=128)
    year = models.PositiveIntegerField()
    city = models.ForeignKey(City, related_name="books", on_delete=models.DO_NOTHING)

    subsection = models.ForeignKey(Subsection, related_name="books", on_delete=models.DO_NOTHING, null=True, blank=True)
    category = models.ForeignKey(Category, related_name="books", on_delete=models.DO_NOTHING)
    legend = models.ForeignKey(Legend, related_name="books",  on_delete=models.DO_NOTHING, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(auto_now=True, editable=False)

    def __str__(self):
        return self.title
