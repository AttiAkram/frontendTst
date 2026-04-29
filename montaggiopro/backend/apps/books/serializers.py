from django.utils.translation import gettext as _

from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers
from pymupdf.mupdf import FzErrorFormat

from . import models
from . import manages


class Book(serializers.ModelSerializer):
    author = serializers.CharField(source="author.name")
    category = serializers.CharField(source="category.name")
    city = serializers.CharField(source="city.name")
    legend = serializers.CharField(source="legend.name", required=False)
    subsection = serializers.CharField(source="subsection.name", required=False)

    class Meta:
        model = models.Book
        fields = '__all__'

    @staticmethod
    def validate_author(value):
        if models.Author.objects.filter(name=value).exists():
            return models.Author.objects.get(name=value)
        raise serializers.ValidationError(_("Author does not exist"))

    @staticmethod
    def validate_category(value):
        if models.Category.objects.filter(name=value).exists():
            return models.Category.objects.get(name=value)
        raise serializers.ValidationError(_("Category does not exist"))

    @staticmethod
    def validate_city(value):
        if models.City.objects.filter(name=value).exists():
            return models.City.objects.get(name=value)
        raise serializers.ValidationError(_("City does not exist"))

    @staticmethod
    def validate_legend(value):
        if models.Legend.objects.filter(name=value).exists():
            return models.Legend.objects.get(name=value)
        raise serializers.ValidationError(_("Legend does not exist"))

    @staticmethod
    def validate_subsection(value):
        if models.Subsection.objects.filter(name=value).exists():
            return models.Subsection.objects.get(name=value)
        raise serializers.ValidationError(_("Subsection does not exist"))

    @staticmethod
    def validate_book(value: InMemoryUploadedFile | None) -> InMemoryUploadedFile | None:
        if value.size > 70 * 1024 * 1024:  # 70 MB
            raise serializers.ValidationError(_("File too large"))
        try:
            manages.get_first_page_of_pdf(value)
            return value
        except FzErrorFormat as e:
            raise serializers.ValidationError(_(f"Error loading PDF: {e}"))

    @staticmethod
    def validate_image(value: InMemoryUploadedFile | None) -> InMemoryUploadedFile | None:
        if value.size < 7 * 1024 * 1024:
            return value
        raise serializers.ValidationError(_("File too large"))

    def validate(self, attrs):
        attrs["author"] = attrs["author"]["name"]
        attrs["category"] = attrs["category"]["name"]
        attrs["city"] = attrs["city"]["name"]
        attrs["legend"] = attrs["legend"]["name"] if attrs.get("legend") else None
        attrs["subsection"] = attrs["subsection"]["name"] if attrs.get("subsection") else None

        if attrs.get("book"):
            attrs.setdefault("image", manages.get_first_page_of_pdf(attrs.get("book")))

        return attrs

    def create(self, validated_data):
        return models.Book.objects.create(**validated_data)
