from django.db import models
from django.conf import settings

class Review(models.Model):
    team       = models.ForeignKey("teams.Team", on_delete=models.CASCADE, related_name="reviews")
    store_name = models.CharField(max_length=128)
    reviewer   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating     = models.DecimalField(max_digits=2, decimal_places=1)
    text       = models.TextField()
    tags       = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ["team","reviewer"]
