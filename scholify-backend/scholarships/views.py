from rest_framework import generics
from .models import Scholarship
from .serializers import ScholarshipSerializer, BookmarkSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bookmark



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
