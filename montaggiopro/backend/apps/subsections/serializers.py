from django.utils.translation import gettext as _

from rest_framework import serializers

from . import models


class Subsection(serializers.ModelSerializer):
    legend = serializers.CharField(source='legend.name', required=False)

    class Meta:
        model = models.Subsection
        fields = '__all__'

    @staticmethod
    def validate_legend(value):
        if models.Legend.objects.filter(name=value).exists():
            return models.Legend.objects.get(name=value)
        raise serializers.ValidationError(_("Legend does not exist"))

    def validate(self, attrs):
        attrs["legend"] = attrs["legend"]["name"] if attrs.get("legend") else None
        return attrs
