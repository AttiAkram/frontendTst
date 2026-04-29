from rest_framework import serializers

from . import models


class PostSerializer(serializers.ModelSerializer):
    team = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    comments_count = serializers.IntegerField(source="comments.count", read_only=True)
    liked = serializers.SerializerMethodField()
    saved = serializers.SerializerMethodField()

    class Meta:
        model = models.Post
        fields = [
            "id", "team", "caption", "city", "tags", "image",
            "likes_count", "comments_count", "liked", "saved", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_team(self, obj):
        t = obj.team
        return {
            "id": t.id,
            "name": t.name,
            "char": t.char,
            "colors": [t.color_from, t.color_to],
            "verified": t.verified,
        }

    def get_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_saved(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.saves.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ["caption", "city", "tags", "image"]

    def create(self, validated_data):
        validated_data["team"] = self.context["request"].user.team
        return super().create(validated_data)


class PostCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.first_name", read_only=True)

    class Meta:
        model = models.PostComment
        fields = ["id", "author_name", "text", "created_at"]
        read_only_fields = ["id", "created_at"]
