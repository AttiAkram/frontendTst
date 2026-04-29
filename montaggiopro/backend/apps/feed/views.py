from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class PostViewSet(ModelViewSet):
    queryset = models.Post.objects.select_related("team").order_by("-created_at")
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.PostCreateSerializer
        return serializers.PostSerializer

    @action(detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        if request.method == "POST":
            _, created = models.PostLike.objects.get_or_create(post=post, user=request.user)
            return Response(
                {"liked": True},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )
        models.PostLike.objects.filter(post=post, user=request.user).delete()
        return Response({"liked": False}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        post = self.get_object()
        if request.method == "POST":
            _, created = models.PostSave.objects.get_or_create(post=post, user=request.user)
            return Response(
                {"saved": True},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )
        models.PostSave.objects.filter(post=post, user=request.user).delete()
        return Response({"saved": False}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()
        if request.method == "GET":
            qs = post.comments.order_by("-created_at")
            page = self.paginate_queryset(qs)
            if page is not None:
                return self.get_paginated_response(
                    serializers.PostCommentSerializer(page, many=True).data
                )
            return Response(serializers.PostCommentSerializer(qs, many=True).data)
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        ser = serializers.PostCommentSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        models.PostComment.objects.create(
            post=post, author=request.user, text=ser.validated_data["text"]
        )
        return Response(ser.data, status=status.HTTP_201_CREATED)
