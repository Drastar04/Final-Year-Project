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
        

class UserSettingsSerializer(serializers.Serializer):
    notifications = serializers.DictField(child=serializers.BooleanField())
    privacy = serializers.DictField()
    preferences = serializers.DictField()
    account = serializers.DictField()