from django.db import models
from django.contrib.auth.models import User

class Scholarship(models.Model):
    title = models.CharField(max_length=200)
    provider = models.CharField(max_length=200, null=True, blank=True)
    amount = models.CharField(max_length=100, null=True, blank=True)
    deadline = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    level = models.CharField(max_length=100, null=True, blank=True)
    application_url = models.URLField()
    is_saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    eligibility = models.JSONField(default=list, null=True, blank=True)
    
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    scholarship = models.ForeignKey('Scholarship', on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'scholarship')

    def __str__(self):
        return f"{self.user.email} bookmarked {self.scholarship.title}"


    def __str__(self):
        return self.title
