from django.db import models
from django.db.models import JSONField
from django.contrib.postgres.fields import ArrayField

# Create your models here.


class Signup(models.Model):
    name = models.CharField(max_length=25, null=False)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=300)
    signedUpAt = models.DateTimeField(auto_now_add=True)


class Computation(models.Model):
    user = models.ForeignKey(Signup, on_delete=models.CASCADE)
    output = JSONField()
    type = models.CharField(max_length=300)
    feedback = models.CharField(max_length=300)
    datetime = models.DateTimeField(auto_now_add=True)
