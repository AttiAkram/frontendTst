from django.db import models
from django.conf import settings

class Job(models.Model):
    JOB_TYPES = [("Cucina","Cucina"),("Bagno","Bagno"),("Living","Living"),
                 ("Camera","Camera"),("Armadio","Armadio"),("Ufficio","Ufficio"),("Completo","Completo")]
    store_name  = models.CharField(max_length=128)
    posted_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posted_jobs")
    type        = models.CharField(max_length=20, choices=JOB_TYPES)
    city        = models.CharField(max_length=64)
    province    = models.CharField(max_length=4)
    date        = models.DateField()
    budget      = models.PositiveIntegerField()
    floor       = models.CharField(max_length=64)
    colli       = models.PositiveIntegerField()
    scala_mot   = models.BooleanField(default=False)
    argano      = models.BooleanField(default=False)
    description = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.type} - {self.city} ({self.date})"

class JobApplication(models.Model):
    job        = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    team       = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ["job","team"]
