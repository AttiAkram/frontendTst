from rest_framework import serializers

from . import models


class TeamSerializer(serializers.ModelSerializer):
    colors = serializers.SerializerMethodField()
    equipment = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(source="reviews.count", read_only=True)
    jobs_count = serializers.SerializerMethodField()
    followers_count = serializers.IntegerField(source="followers.count", read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = models.Team
        fields = [
            "id", "name", "leader", "char", "colors", "members", "experience",
            "rating", "reviews_count", "jobs_count", "followers_count",
            "verified", "zones", "specs", "equipment", "bio",
            "is_following", "created_at",
        ]
        read_only_fields = ["id", "verified", "created_at"]

    def get_colors(self, obj):
        return [obj.color_from, obj.color_to]

    def get_equipment(self, obj):
        return {
            "van": obj.van_size,
            "vanM3": obj.van_m3,
            "scalaMot": obj.scala_mot,
            "argano": obj.argano,
        }

    def get_rating(self, obj):
        from django.db.models import Avg
        avg = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(float(avg), 1) if avg else 0

    def get_jobs_count(self, obj):
        from apps.jobs.models import JobApplication
        return JobApplication.objects.filter(team=obj).count()

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.followers.filter(follower=request.user).exists()
        return False


class TeamCreateSerializer(serializers.ModelSerializer):
    color_from = serializers.CharField(default="#0095F6")
    color_to = serializers.CharField(default="#00C6FF")

    class Meta:
        model = models.Team
        fields = [
            "name", "leader", "char", "color_from", "color_to",
            "members", "experience", "bio", "specs", "zones",
            "van_size", "van_m3", "scala_mot", "argano",
        ]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


class TeamAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamAvailability
        fields = ["id", "date", "status"]
        read_only_fields = ["id"]
