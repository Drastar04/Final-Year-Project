from rest_framework import serializers
from .models import Scholarship, Bookmark

class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = '__all__'

class BookmarkSerializer(serializers.ModelSerializer):
    scholarship = ScholarshipSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'scholarship', 'created_at']
