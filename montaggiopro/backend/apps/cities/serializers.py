from rest_framework import serializers

from . import models


class City(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = '__all__'
