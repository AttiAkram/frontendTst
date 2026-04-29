from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class IsTeamOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class TeamViewSet(ModelViewSet):
    queryset = models.Team.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.TeamCreateSerializer
        return serializers.TeamSerializer

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            return [IsTeamOwner()]
        return super().get_permissions()

    @action(detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        team = self.get_object()
        if request.method == "POST":
            _, created = models.TeamFollow.objects.get_or_create(
                follower=request.user, team=team
            )
            if not created:
                return Response({"detail": "Already following."}, status=status.HTTP_200_OK)
            return Response({"detail": "Followed."}, status=status.HTTP_201_CREATED)
        models.TeamFollow.objects.filter(follower=request.user, team=team).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get"])
    def posts(self, request, pk=None):
        team = self.get_object()
        from apps.feed.serializers import PostSerializer
        qs = team.posts.order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(
                PostSerializer(page, many=True, context={"request": request}).data
            )
        return Response(PostSerializer(qs, many=True, context={"request": request}).data)

    @action(detail=True, methods=["get"])
    def reviews(self, request, pk=None):
        team = self.get_object()
        from apps.reviews.serializers import ReviewSerializer
        qs = team.reviews.order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(
                ReviewSerializer(page, many=True).data
            )
        return Response(ReviewSerializer(qs, many=True).data)

    @action(detail=True, methods=["get", "post"], url_path="availability")
    def availability(self, request, pk=None):
        team = self.get_object()
        if request.method == "GET":
            qs = team.availability.order_by("date")
            return Response(serializers.TeamAvailabilitySerializer(qs, many=True).data)
        if team.owner != request.user:
            return Response(
                {"detail": "Solo il proprietario può modificare la disponibilità."},
                status=status.HTTP_403_FORBIDDEN,
            )
        ser = serializers.TeamAvailabilitySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        obj, _ = models.TeamAvailability.objects.update_or_create(
            team=team, date=ser.validated_data["date"],
            defaults={"status": ser.validated_data["status"]},
        )
        return Response(
            serializers.TeamAvailabilitySerializer(obj).data,
            status=status.HTTP_200_OK,
        )
