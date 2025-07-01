from rest_framework import generics, permissions
from .models import Bookmark, Scholarship
from .serializers import BookmarkSerializer, ScholarshipSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bookmark, Scholarship  # make sure you have a Bookmark model


class UserBookmarksView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookmarkSerializer

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('scholarship')


class UserRecommendationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ScholarshipSerializer

    def get_queryset(self):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.major:
            return Scholarship.objects.filter(category__icontains=profile.major)[:10]
        return Scholarship.objects.none()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):
    user = request.user
    bookmarks = Bookmark.objects.filter(user=user)
    # Add apps or recs here if you have them

    return Response({
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        "bookmarks": [
            {
                "id": b.scholarship.id,
                "title": b.scholarship.title,
                "amount": b.scholarship.amount,
                "deadline": b.scholarship.deadline,
                "application_url": b.scholarship.application_url,
            } for b in bookmarks
        ],
        "applications": [],
        "recommendations": [],
    })

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookmarks(request):
    user = request.user
    # Fetch bookmarks belonging to the user
    bookmarks = Bookmark.objects.filter(user=user)
    # Serialize bookmarks (assuming BookmarkSerializer exists)
    from .serializers import BookmarkSerializer
    serializer = BookmarkSerializer(bookmarks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_recommendations(request):
    user = request.user
    # Implement your logic for recommendations here
    # For now, a simple example: return first 5 scholarships
    from .models import Scholarship
    from .serializers import ScholarshipSerializer
    scholarships = Scholarship.objects.all()[:5]
    serializer = ScholarshipSerializer(scholarships, many=True)
    return Response(serializer.data)