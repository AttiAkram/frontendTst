from rest_framework import serializers

from . import models


class MessageSerializer(serializers.ModelSerializer):
    me = serializers.SerializerMethodField()

    class Meta:
        model = models.Message
        fields = ["id", "sender", "text", "created_at", "read", "me"]
        read_only_fields = ["id", "sender", "created_at"]

    def get_me(self, obj):
        request = self.context.get("request")
        if request:
            return obj.sender == request.user
        return False


class ConversationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    char = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()
    last = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = models.Conversation
        fields = ["id", "name", "char", "colors", "last", "time", "unread", "created_at"]
        read_only_fields = ["id", "created_at"]

    def _other_participant(self, obj):
        request = self.context.get("request")
        if request:
            return obj.participants.exclude(id=request.user.id).first()
        return obj.participants.first()

    def get_name(self, obj):
        other = self._other_participant(obj)
        return f"{other.first_name} {other.last_name}" if other else "Utente"

    def get_char(self, obj):
        other = self._other_participant(obj)
        return other.first_name[0].upper() if other and other.first_name else "?"

    def get_colors(self, obj):
        return ["#0095F6", "#00C6FF"]

    def get_last(self, obj):
        msg = obj.messages.order_by("-created_at").first()
        return msg.text[:50] if msg else ""

    def get_time(self, obj):
        msg = obj.messages.order_by("-created_at").first()
        if msg:
            return msg.created_at.strftime("%H:%M")
        return ""

    def get_unread(self, obj):
        request = self.context.get("request")
        if request:
            return obj.messages.filter(read=False).exclude(sender=request.user).count()
        return 0


class ConversationCreateSerializer(serializers.Serializer):
    participant_id = serializers.IntegerField()
    message = serializers.CharField()
