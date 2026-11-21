from rest_framework import serializers
from . import models


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Signup
        fields = ('id', 'name', 'email', 'password', 'signedUpAt')


class ComputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Computation
        fields = ('id', 'user', 'output', 'type', 'feedback', 'datetime')
