from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, GroupViewSet, GoalViewSet, DailyReportViewSet, leaderboard, user_notifications,SignupView,LoginView,LogoutView,BadgeViewSet,user_detail


router = DefaultRouter()
router.register('users', UserViewSet)
router.register('groups', GroupViewSet)
router.register('goals', GoalViewSet)
router.register('badges', BadgeViewSet)
router.register('daily-reports', DailyReportViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', leaderboard, name='leaderboard'),
    path('notifications/', user_notifications, name='user_notifications'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-detail/', user_detail, name='user-detail'),

]


