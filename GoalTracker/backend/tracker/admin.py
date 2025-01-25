from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Group, Goal, DailyReport, Badge, Notification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    list_display = ['id','username', 'email', 'is_staff', 'is_active','points','get_badges']

    def get_badges(self, obj):
        return ", ".join([badge.name for badge in obj.badges.all()])  # Show badge names
    get_badges.short_description = "Badges"


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'created_at']
    filter_horizontal = ['members']


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['title','scope','timeline','created_by', 'start_date', 'end_date', 'is_completed']


@admin.register(DailyReport)
class DailyReportAdmin(admin.ModelAdmin):
    list_display = ['goal', 'date', 'status']



@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'points_required']  # Display badge details


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['user__username', 'message']
