from django.db import models
from django.conf import settings

class Post(models.Model):
    team       = models.ForeignKey("teams.Team", on_delete=models.CASCADE, related_name="posts")
    caption    = models.TextField()
    city       = models.CharField(max_length=64, blank=True)
    tags       = models.JSONField(default=list)
    image      = models.ImageField(upload_to="posts/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.team.name} - {self.created_at.date()}"

class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    class Meta: unique_together = ["post","user"]

class PostSave(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="saves")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    class Meta: unique_together = ["post","user"]

class PostComment(models.Model):
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
