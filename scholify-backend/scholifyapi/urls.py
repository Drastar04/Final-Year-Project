from django.contrib import admin
from django.urls import path, include
from scholarships.auth_views import get_authenticated_user
from scholarships.dashboard_views import get_user_bookmarks, get_user_recommendations

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/scholarships/', include('scholarships.urls')),
    path('api/auth/', include('scholarships.auth_urls')),  # handles login/register
    
    # Authenticated user + dashboard data
    path('api/auth/user/', get_authenticated_user),  # GET
    path('api/dashboard/bookmarks/', get_user_bookmarks),  # GET
    path('api/dashboard/recommendations/', get_user_recommendations),  # GET
]
