from rest_framework import serializers

from . import models


class Legend(serializers.ModelSerializer):
    class Meta:
        model = models.Legend
        fields = '__all__'
