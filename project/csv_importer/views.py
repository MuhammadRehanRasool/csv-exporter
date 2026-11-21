from ast import Delete, parse
from functools import partial
from rest_framework import status
from rest_framework.serializers import Serializer
from . import serializers
from . import models
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password
import pandas as pd
import numpy as np


@api_view(['GET'])
def index(request):
    return JsonResponse({'message': 'Welcome'}, safe=False)


@api_view(['GET', 'POST', 'DELETE'])
def users_list(request):
    if request.method == 'GET':
        Signup = models.Signup.objects.all()
        signup_serializer = serializers.SignupSerializer(Signup, many=True)
        return JsonResponse(signup_serializer.data, safe=False)

    elif request.method == 'POST':
        user_data = JSONParser().parse(request)
        user_data["password"] = make_password(user_data["password"])
        signup_serializer = serializers.SignupSerializer(data=user_data)
        if signup_serializer.is_valid():
            signup_serializer.save()
            payload = signup_serializer.data
            del payload["password"]
            return JsonResponse(payload, status=status.HTTP_200_OK)
        return JsonResponse({'message': 'User Already Exists'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        count = models.Signup.objects.all().delete()
        return JsonResponse({'message': 'All Deleted'}, status=status.HTTP_200_OK)

# To add and get users


@api_view(['POST'])
def login_check(request):
    if request.method == 'POST':
        Signup = models.Signup.objects.all()
        email = request.data.get("email")
        password = request.data.get("password")
        if email and password is not None:
            count = Signup.filter(email=email).count()
            if count != 0:
                data = Signup.filter(email=email).values('password').first()
                if check_password(password, data["password"]):
                    userData = Signup.filter(email=email)
                    SerializedData = serializers.SignupSerializer(
                        userData, many=True)
                    payload = SerializedData.data[0]
                    del payload["password"]
                    return JsonResponse(payload, safe=False)
                else:
                    return JsonResponse({'message': 'Wrong Password'}, safe=False)
            else:
                return JsonResponse({'message': 'No Account Exists'}, status=status.HTTP_200_OK)
    return JsonResponse({'message': 'Not applicable'}, status=status.HTTP_200_OK)

# To make login


@api_view(['GET', 'POST'])
def raw_data(request):
    if request.method == 'GET':
        Computation = models.Computation.objects.all()
        computation_serializer = serializers.ComputationSerializer(
            Computation, many=True)
        return JsonResponse(computation_serializer.data, safe=False)
    if request.method == 'POST':
        raw = request.data["raw"]
        type = request.data["type"]
        user = request.data["user"]
        df = pd.DataFrame(raw)
        data = []
        feedback = "Nothing to show"
        if type == "sumOfMontant":
            df["Montant"] = df["Montant"].astype(float).astype(int)
            df["EcritureDate"] = df["EcritureDate"].astype(float).astype(int)
            df["CompteNum"] = df["CompteNum"].astype(float).astype(int)
            pivot = pd.pivot_table(data=df.loc[:, ["EcritureDate", "CompteNum", "Montant"]], index=[
                'EcritureDate', 'CompteNum'], aggfunc=np.sum)
            pivot = pivot.reset_index()
            data = pivot.to_json(orient='columns')
            feedback = "Sum of Montant based on EcritureDate and CompteNum"
            # above pivot is for sum of Montant based on EcritureDate and CompteNum

        # Add to database
        computation_serializer = serializers.ComputationSerializer(data={
            "user": user,
            "output": data,
            "type": type,
            "feedback": feedback
        })
        if computation_serializer.is_valid():
            computation_serializer.save()
            payload = computation_serializer.data
        return JsonResponse(payload, status=status.HTTP_200_OK)
    return JsonResponse({'message': 'Not applicable'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
def log(request, pk):
    if request.method == 'GET':
        User = models.Signup.objects.filter(pk=pk)
        if len(User) == 0:
            return JsonResponse({'message': 'No User Exists'}, status=status.HTTP_200_OK)
        Computation = models.Computation.objects.filter(user=pk).order_by('-datetime')
        if len(Computation) == 0:
            return JsonResponse({'message': 'No Past Records'}, status=status.HTTP_200_OK)
        computation_serializer = serializers.ComputationSerializer(
            Computation, many=True)
        return JsonResponse(computation_serializer.data, safe=False)
    return JsonResponse({'message': 'Not applicable'}, status=status.HTTP_200_OK)
