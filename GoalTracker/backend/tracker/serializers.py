from rest_framework import serializers
from .models import User, Group, Goal, DailyReport , Notification, Badge


class UserSerializer(serializers.ModelSerializer):
    badges = serializers.StringRelatedField(many=True)
    completed_goals_count = serializers.SerializerMethodField()  # Add this field

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','points', 'badges','completed_goals_count']


    def get_completed_goals_count(self, obj):
        # Count goals where `is_completed=True` for the user
        return Goal.objects.filter(created_by=obj, is_completed=True).count()



class BadgeSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'points_required', 'users']
        # extra_kwargs = {
        #     'users': {'read_only': True},  # Prevent users from being updated via this serializer
        # }
        
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'created_by']
        read_only_fields = ['created_by'] 

    # def validate_created_by(self, value):
    #     if not User.objects.filter(id=value).exists():
    #         raise serializers.ValidationError("Invalid user ID.")
    #     return value

 

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'



class DailyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReport
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at', 'is_read']
