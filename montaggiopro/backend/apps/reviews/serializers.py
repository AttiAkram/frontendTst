from rest_framework import serializers

from . import models


class ReviewSerializer(serializers.ModelSerializer):
    store = serializers.SerializerMethodField()
    reviewer_name = serializers.CharField(source="reviewer.first_name", read_only=True)

    class Meta:
        model = models.Review
        fields = [
            "id", "team", "store", "store_name", "reviewer_name",
            "rating", "text", "tags", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_store(self, obj):
        return {
            "name": obj.store_name,
            "char": obj.store_name[0].upper() if obj.store_name else "?",
            "colors": ["#0095F6", "#00C6FF"],
        }

    def create(self, validated_data):
        validated_data["reviewer"] = self.context["request"].user
        return super().create(validated_data)
