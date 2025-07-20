from rest_framework import generics, status
from .models import Scholarship, UserSettings
from .serializers import ScholarshipSerializer, BookmarkSerializer, UserSettingsSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bookmark
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated




class ScholarshipListCreateAPIView(generics.ListCreateAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer

class ScholarshipRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookmarks(request):
    user = request.user
    bookmarks = Bookmark.objects.filter(user=user).select_related('scholarship')
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)


class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings_obj, created = UserSettings.objects.get_or_create(user=request.user)
        if not settings_obj.data:
            # Provide default settings if empty
            default_settings = {
                "notifications": {
                    "emailNotifications": True,
                    "pushNotifications": False,
                    "deadlineReminders": True,
                    "applicationUpdates": True,
                    "weeklyDigest": False,
                },
                "privacy": {
                    "profileVisibility": "private",
                    "shareAchievements": False,
                    "allowMessages": True,
                },
                "preferences": {
                    "theme": "light",
                    "language": "english",
                    "timezone": "EST",
                    "currency": "USD",
                },
                "account": {
                    "twoFactorAuth": False,
                    "loginAlerts": True,
                },
            }
            settings_obj.data = default_settings
            settings_obj.save()

        return Response(settings_obj.data)

    def put(self, request):
        serializer = UserSettingsSerializer(data=request.data)
        if serializer.is_valid():
            settings_obj, _ = UserSettings.objects.get_or_create(user=request.user)
            settings_obj.data = serializer.validated_data
            settings_obj.save()
            return Response(settings_obj.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
