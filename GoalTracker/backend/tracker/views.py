from rest_framework import viewsets
from .models import User, Group, Goal, DailyReport, Notification, Badge
from .serializers import (
    UserSerializer, GroupSerializer, GoalSerializer,
    DailyReportSerializer, NotificationSerializer, BadgeSerializer
)
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken

# In-memory dictionary to track logged-in users
# LOGGED_IN_USERS = {}

# ---------------------------------
# User ViewSet
# ---------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)  # Get only logged-in user's data


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=200)

# ---------------------------------
# Badge ViewSet
# ---------------------------------
class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Badge.objects.filter(users=self.request.user)

# ---------------------------------
# Group ViewSet
# ---------------------------------
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return groups where the logged-in user is a member or creator.
        """
        return Group.objects.filter(members=self.request.user) | Group.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        """
        Set the logged-in user as the creator of the group.
        """
        serializer.save(created_by=self.request.user)
# ---------------------------------
# Goal ViewSet
# ---------------------------------
class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Override the queryset to filter goals for the logged-in user.
        - Show goals created by the user (personal goals).
        - Show goals assigned to groups that the user is a member of.
        """
        return Goal.objects.filter(created_by=self.request.user) | Goal.objects.filter(group__members=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Override create to set the logged-in user as the creator.
        """
        serializer.save(created_by=self.request.user)


    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

# ---------------------------------
# Daily Report ViewSet
# ---------------------------------
class DailyReportViewSet(viewsets.ModelViewSet):
    queryset = DailyReport.objects.all()
    serializer_class = DailyReportSerializer
    permission_classes = [IsAuthenticated]

# ---------------------------------
# Leaderboard API
# ---------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    users = User.objects.order_by('-points')[:10]
    data = [{'username': user.username, 'points': user.points} for user in users]
    return Response(data)

# ---------------------------------
# Notifications API
# ---------------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_notifications(request):
    user = request.user  # Use authenticated user
    if request.method == 'POST':
        notification_id = request.data.get('id')
        if not notification_id:
            return Response({"error": "Notification ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read.'})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

    notifications = Notification.objects.filter(user=user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


def get_access_token_for_user(user):
    return str(AccessToken.for_user(user))  # Generate JWT Access Token

# ---------------------------------
# Login API
# ---------------------------------
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            LOGGED_IN_USERS[username] = True
            token = get_access_token_for_user(user)
            return Response({"message": "Login successful", "access_token": token}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

# ---------------------------------
# Logout API
# ---------------------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# ---------------------------------
# Signup API
# ---------------------------------
class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
