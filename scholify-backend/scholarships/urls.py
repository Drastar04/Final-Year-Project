from django.urls import path
from .views import ScholarshipListCreateAPIView, ScholarshipRetrieveUpdateDestroyAPIView, UserSettingsView
from . import auth_views
from . import views
from . import dashboard_views  # 👈 import the dashboard view file 
from scholarships.dashboard_views import get_user_bookmarks, get_user_recommendations


urlpatterns = [
    # Scholarship endpoints
    path('', ScholarshipListCreateAPIView.as_view(), name='scholarship-list'),
    path('<int:pk>/', ScholarshipRetrieveUpdateDestroyAPIView.as_view(), name='scholarship-detail'),

    # Authentication endpoints
    path('register/', auth_views.register_user, name='register'),
    path('login/', auth_views.login_user, name='login'),
    # path('user/', views.user_view),

    # ✅ NEW ROUTE for /api/dashboard/
    path('dashboard/', dashboard_views.dashboard_overview),
   # scholifyapi/urls.py or scholarships/urls.py
    path('api/dashboard/bookmarks/', get_user_bookmarks),
    path('api/dashboard/recommendations/', get_user_recommendations),
    
    path('settings/', UserSettingsView.as_view(), name='user-settings'),

]
