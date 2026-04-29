from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from . import models, serializers

User = get_user_model()


class ConversationViewSet(ModelViewSet):
    serializer_class = serializers.ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Conversation.objects.filter(
            participants=self.request.user
        ).order_by("-updated_at")

    def create(self, request, *args, **kwargs):
        ser = serializers.ConversationCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        other_id = ser.validated_data["participant_id"]
        try:
            other = User.objects.get(id=other_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Utente non trovato."},
                status=status.HTTP_404_NOT_FOUND,
            )
        existing = models.Conversation.objects.filter(
            participants=request.user
        ).filter(participants=other).first()
        if existing:
            conv = existing
        else:
            conv = models.Conversation.objects.create()
            conv.participants.add(request.user, other)
        models.Message.objects.create(
            conversation=conv,
            sender=request.user,
            text=ser.validated_data["message"],
        )
        return Response(
            serializers.ConversationSerializer(conv, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get", "post"], url_path="messages")
    def messages(self, request, pk=None):
        conv = self.get_object()
        if request.method == "GET":
            qs = conv.messages.order_by("created_at")
            conv.messages.filter(read=False).exclude(sender=request.user).update(read=True)
            page = self.paginate_queryset(qs)
            ctx = {"request": request}
            if page is not None:
                return self.get_paginated_response(
                    serializers.MessageSerializer(page, many=True, context=ctx).data
                )
            return Response(
                serializers.MessageSerializer(qs, many=True, context=ctx).data
            )
        msg_ser = serializers.MessageSerializer(data=request.data)
        msg_ser.is_valid(raise_exception=True)
        msg = models.Message.objects.create(
            conversation=conv,
            sender=request.user,
            text=msg_ser.validated_data["text"],
        )
        conv.save()
        return Response(
            serializers.MessageSerializer(msg, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )
