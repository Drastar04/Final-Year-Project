from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import redirect

@api_view(['POST'])
def register_user(request):
    data = request.data
    if User.objects.filter(username=data['email']).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        password=data['password'],
        first_name=data.get('firstName', ''),
        last_name=data.get('lastName', '')
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'message': 'User registered successfully'})

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'No user found with this email'}, status=400)

    user = authenticate(username=user.username, password=password)
    if not user:
        return Response({'error': 'Incorrect password'}, status=400)

    token, created = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user_id': user.id,
        'email': user.email,
        'username': user.username
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "username": user.username,
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def redirect_to_dashboard(request):
    return redirect('/api/dashboard/bookmarks/')