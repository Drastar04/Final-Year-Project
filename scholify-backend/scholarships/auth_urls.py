from django.urls import path
from .auth_views import register_user, login_user
from .dashboard_views import UserBookmarksView, UserRecommendationsView
from .views import get_user_bookmarks
from .auth_views import redirect_to_dashboard


urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('dashboard/', redirect_to_dashboard),
    path('dashboard/bookmarks/', UserBookmarksView.as_view(), name='user-bookmarks'),
    path('dashboard/recommendations/', UserRecommendationsView.as_view(), name='user-recommendations'),
     path('dashboard/bookmarks/', get_user_bookmarks, name='user-bookmarks'),
]

