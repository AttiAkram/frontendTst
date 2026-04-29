from rest_framework import serializers

from . import models


class JobSerializer(serializers.ModelSerializer):
    store = serializers.SerializerMethodField()
    applied = serializers.SerializerMethodField()
    applications_count = serializers.IntegerField(
        source="applications.count", read_only=True
    )

    class Meta:
        model = models.Job
        fields = [
            "id", "store", "store_name", "type", "city", "province",
            "date", "budget", "floor", "colli", "scala_mot", "argano",
            "description", "applied", "applications_count", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_store(self, obj):
        return {
            "name": obj.store_name,
            "char": obj.store_name[0].upper() if obj.store_name else "?",
            "colors": ["#0095F6", "#00C6FF"],
        }

    def get_applied(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            try:
                team = request.user.team
                return obj.applications.filter(team=team).exists()
            except Exception:
                return False
        return False


class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Job
        fields = [
            "store_name", "type", "city", "province", "date",
            "budget", "floor", "colli", "scala_mot", "argano", "description",
        ]

    def create(self, validated_data):
        validated_data["posted_by"] = self.context["request"].user
        return super().create(validated_data)


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobApplication
        fields = ["id", "job", "team", "applied_at"]
        read_only_fields = ["id", "applied_at"]
