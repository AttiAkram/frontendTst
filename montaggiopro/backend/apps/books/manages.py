from io import BytesIO
from PIL import Image

from django.db.models import QuerySet
from django.db.models.manager import Manager
from django.core.files.uploadedfile import InMemoryUploadedFile

import fitz


def get_first_page_of_pdf(pdf_file: InMemoryUploadedFile) -> InMemoryUploadedFile | None:
    if pdf_file is None:
        return None

    pdf_document = fitz.open(stream=pdf_file.open().read(), filetype="pdf")
    first_page = pdf_document.load_page(0)

    # Render the page to a PIL image
    pix = first_page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    # Save the image to an in-memory file
    image_io = BytesIO()
    img.save(image_io, format='PNG')
    image_io.seek(0)

    # Create an InMemoryUploadedFile
    image_file = InMemoryUploadedFile(
        image_io,
        None,
        'book_cover.png',
        'image/png',
        image_io.getbuffer().nbytes,
        None
    )
    return image_file


class BookQuerySet(QuerySet):

    def create(self, **kwargs):
        kwargs.setdefault("image", get_first_page_of_pdf(kwargs.get("book")))
        return super().create(**kwargs)

    def update(self, **kwargs):
        kwargs.setdefault("image", get_first_page_of_pdf(kwargs.get("book")))
        return super().update(**kwargs)


class Book(Manager):

    def get_queryset(self):
        return BookQuerySet(self.model, using=self._db)

