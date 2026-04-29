from django.db import models
from django.conf import settings

class VanSize(models.TextChoices):
    SMALL  = "piccolo", "Piccolo (fino a 8m3)"
    MEDIUM = "medio",   "Medio (fino a 14m3)"
    LARGE  = "grande",  "Grande (fino a 22m3)"

class Team(models.Model):
    name       = models.CharField(max_length=128)
    leader     = models.CharField(max_length=128)
    members    = models.PositiveIntegerField(default=1)
    experience = models.PositiveIntegerField(default=0)
    bio        = models.TextField(blank=True)
    verified   = models.BooleanField(default=False)
    owner      = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team")
    specs      = models.JSONField(default=list)
    zones      = models.JSONField(default=list)
    color_from = models.CharField(max_length=7, default="#0095F6")
    color_to   = models.CharField(max_length=7, default="#00C6FF")
    char       = models.CharField(max_length=1, default="T")
    van_size   = models.CharField(max_length=10, choices=VanSize.choices, default=VanSize.MEDIUM)
    van_m3     = models.PositiveIntegerField(default=12)
    scala_mot  = models.BooleanField(default=False)
    argano     = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class TeamAvailability(models.Model):
    STATUS = [("free","Disponibile"),("partial","Parziale"),("busy","Occupato")]
    team   = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="availability")
    date   = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS, default="free")
    class Meta: unique_together = ["team","date"]

class TeamFollow(models.Model):
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    team     = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ["follower","team"]
