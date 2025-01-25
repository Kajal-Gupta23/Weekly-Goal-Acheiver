from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


class User(AbstractUser):
    email = models.EmailField(unique=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.username


class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, related_name='group_members')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Goal(models.Model):
    DAILY = 'daily'
    WEEKLY = 'weekly'
    FLEXIBLE = 'flexible'
    TIMELINE_CHOICES = [
        (DAILY, 'Daily'),
        (WEEKLY, 'Weekly'),
        (FLEXIBLE, 'Flexible'),
    ]

    INDIVIDUAL = 'individual'
    GROUP = 'group'
    SCOPE_CHOICES = [
        (INDIVIDUAL, 'Individual'),
        (GROUP, 'Group'),
    ]

    PUBLIC = 'public'
    PRIVATE = 'private'
    VISIBILITY_CHOICES = [
        (PUBLIC, 'Public'),
        (PRIVATE, 'Private'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    timeline = models.CharField(max_length=10, choices=TIMELINE_CHOICES)
    scope = models.CharField(max_length=10, choices=SCOPE_CHOICES)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='goals')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    start_date = models.DateField(default=now)
    end_date = models.DateField()
    points_awarded = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.get_scope_display()}, {self.get_timeline_display()})"


class DailyReport(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='daily_reports')
    date = models.DateField(default=now)
    status = models.BooleanField(default=False)  # True = Completed, False = Not Completed

    def __str__(self):
        return f"{self.goal.title} - {self.date} - {'Completed' if self.status else 'Not Completed'}"


class Badge(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    points_required = models.IntegerField()  # Points needed to earn the badge
    users = models.ManyToManyField('User', related_name='badges', blank=True) 

    def __str__(self):
        return self.name


class Notification(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()  # The content of the notification
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for the notification
    is_read = models.BooleanField(default=False)  # Whether the user has read the notification

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"

        
