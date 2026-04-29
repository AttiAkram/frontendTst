from rest_framework import serializers

from . import models


class Author(serializers.ModelSerializer):
    class Meta:
        model = models.Author
        fields = "__all__"
