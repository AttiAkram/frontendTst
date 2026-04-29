from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from . import models, serializers


class JobViewSet(ModelViewSet):
    queryset = models.Job.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.JobCreateSerializer
        return serializers.JobSerializer

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        try:
            team = request.user.team
        except Exception:
            return Response(
                {"detail": "Devi avere una squadra per candidarti."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        _, created = models.JobApplication.objects.get_or_create(job=job, team=team)
        if not created:
            return Response(
                {"detail": "Candidatura già inviata."},
                status=status.HTTP_200_OK,
            )
        return Response({"detail": "Candidatura inviata."}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="mine", permission_classes=[IsAuthenticated])
    def my_jobs(self, request):
        try:
            team = request.user.team
        except Exception:
            return Response([])
        applied_ids = models.JobApplication.objects.filter(team=team).values_list("job_id", flat=True)
        qs = models.Job.objects.filter(id__in=applied_ids).order_by("-created_at")
        page = self.paginate_queryset(qs)
        ser_ctx = {"request": request}
        if page is not None:
            return self.get_paginated_response(
                serializers.JobSerializer(page, many=True, context=ser_ctx).data
            )
        return Response(serializers.JobSerializer(qs, many=True, context=ser_ctx).data)
