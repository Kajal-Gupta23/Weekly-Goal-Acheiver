from rest_framework import viewsets
from .models import User, Group, Goal, DailyReport, Notification, Badge
from .serializers import (
    UserSerializer, GroupSerializer, GoalSerializer,
    DailyReportSerializer, NotificationSerializer, BadgeSerializer
)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate

# In-memory dictionary to track logged-in users
LOGGED_IN_USERS = {}

# ---------------------------------
# User ViewSet
# ---------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
def user_detail(request):
    username = request.query_params.get("username")
    if not username:
        return Response({"error": "Username is required"}, status=400)

    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

# ---------------------------------
# Badge ViewSet
# ---------------------------------
class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer

    def get_queryset(self):
        username = self.request.query_params.get("username")
        if username in LOGGED_IN_USERS and LOGGED_IN_USERS[username]:
            return Badge.objects.filter(users__username=username)
        return Badge.objects.none()

# ---------------------------------
# Group ViewSet
# ---------------------------------
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        """
        Return groups where the logged-in user is a member or creator.
        """
        username = self.request.query_params.get("username")
        if username in LOGGED_IN_USERS:
            user = User.objects.get(username=username)
            print(user)
            return Group.objects.filter(members=user) | Group.objects.filter(created_by=user)
        return Group.objects.none()

    def perform_create(self, serializer):
        """
        Set the logged-in user as the creator of the group.
        """
        username = self.request.query_params.get("username")
        print(f"Username from request: {username}")
        print(f"LOGGED_IN_USERS: {LOGGED_IN_USERS}")

        if username in LOGGED_IN_USERS:
            user = User.objects.get(username=username)
            print(f"User found: {user}")
            serializer.save(created_by=user)  # Set created_by here
        else:
            print("No user found or user not logged in.")
            raise ValueError("User must be logged in to create a group.")
# ---------------------------------
# Goal ViewSet
# ---------------------------------
class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        """
        Override the queryset to filter goals for the logged-in user.
        - Show goals created by the user (personal goals).
        - Show goals assigned to groups that the user is a member of.
        """
        if self.kwargs.get('pk'):  # Check if a specific goal ID is being queried
            return Goal.objects.all()
        username = self.request.query_params.get("username")
        if not username or username not in LOGGED_IN_USERS:
            return Goal.objects.none()  # Return no goals if the user is not logged in

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Goal.objects.none()

        # Fetch personal goals and group goals
        personal_goals = Goal.objects.filter(created_by=user)
        group_goals = Goal.objects.filter(group__members=user)

        # Combine both queries
        return personal_goals | group_goals

    def create(self, request, *args, **kwargs):
        """
        Override create to set the logged-in user as the creator.
        """
        username = self.request.query_params.get("username")
        if not username or username not in LOGGED_IN_USERS:
            return Response({"error": "User is not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(username=username)
            request.data["created_by"] = user.id  # Set the correct user ID
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

# ---------------------------------
# Leaderboard API
# ---------------------------------
@api_view(['GET'])
def leaderboard(request):
    username = request.query_params.get("username")
    if not username or username not in LOGGED_IN_USERS:
        return Response({"error": "User is not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

    users = User.objects.order_by('-points')[:10]
    data = [{'username': user.username, 'points': user.points} for user in users]
    return Response(data)

# ---------------------------------
# Notifications API
# ---------------------------------
@api_view(['GET', 'POST'])
def user_notifications(request):
    username = request.data.get("username") or request.query_params.get("username")
    if not username or username not in LOGGED_IN_USERS:
        return Response({"error": "User is not logged in."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'POST':
        notification_id = request.data.get('id')
        if not notification_id:
            return Response({"error": "Notification ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = Notification.objects.get(id=notification_id, user__username=username)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read.'})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

    notifications = Notification.objects.filter(user__username=username).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

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
            return Response({"message": "Login successful", "username": username}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

# ---------------------------------
# Logout API
# ---------------------------------
class LogoutView(APIView):
    def post(self, request):
        username = request.data.get('username')
        if username in LOGGED_IN_USERS:
            LOGGED_IN_USERS.pop(username)
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        return Response({"error": "User is not logged in."}, status=status.HTTP_400_BAD_REQUEST)

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
