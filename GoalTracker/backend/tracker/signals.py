# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Goal, User,Badge, Notification
# import logging

# logger = logging.getLogger(__name__)

# @receiver(post_save, sender=Goal)
# def award_points(sender, instance, **kwargs):
    
#     if instance.is_completed and not instance.points_awarded:
#         points = 10  # Assign a fixed number of points for now
#         user = instance.created_by
#         user.points += points
#         user.save()

#         # Mark points as awarded for this goal
#         instance.points_awarded = True
#         instance.save()


# @receiver(post_save, sender=User)
# def check_badges(sender, instance, **kwargs):
#     badges = Badge.objects.all()
#     for badge in badges:
#         if instance.points >= badge.points_required and badge not in instance.badges.all():
#             instance.badges.add(badge)




# @receiver(post_save, sender=Goal)
# def notify_goal_completed(sender, instance, **kwargs):
#     """
#     Signal to create a notification when a goal is marked as completed.
#     """
#     if instance.is_completed:
#         # Check if a notification for this goal already exists
#         if not Notification.objects.filter(
#             user=instance.created_by, message=f"🎉 You’ve completed the goal: {instance.title}!"
#         ).exists():
#             Notification.objects.create(
#                 user=instance.created_by,
#                 message=f"🎉 You’ve completed the goal: {instance.title}!"
#             )


# # @receiver(post_save, sender=User)
# # def notify_badge_awarded(sender, instance, **kwargs):
# #     logger.info(f"Signal triggered for user: {instance.username}")

# #     badges = Badge.objects.all()
# #     for badge in badges:
# #         # Check if the user qualifies for the badge and hasn't been awarded it
# #         if instance.points >= badge.points_required and badge not in instance.badges.all():
# #             instance.badges.add(badge)  # Award the badge

# #             # Check if a notification for this badge already exists
# #             if not Notification.objects.filter(
# #                 user=instance, message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
# #             ).exists():
# #                 Notification.objects.create(
# #                     user=instance,
# #                     message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
# #                 )


# @receiver(post_save, sender=User)
# def notify_badge_awarded(sender, instance, **kwargs):
#     """
#     Signal to award badges to users based on points and notify them.
#     """
#     badges = Badge.objects.all()

#     for badge in badges:
#         # Check if the user qualifies for the badge and it is already assigned
#         if instance.points >= badge.points_required and badge in instance.badges.all():
#             # Check if a notification for this badge already exists
#             if not Notification.objects.filter(
#                 user=instance, message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
#             ).exists():
#                 # Create a notification
#                 Notification.objects.create(
#                     user=instance,
#                     message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
#                 )



from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Goal, User, Badge, Notification
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Goal)
def award_points(sender, instance, **kwargs):
    """
    Signal to award points to the user when a goal is completed.
    """
    if instance.is_completed and not instance.points_awarded:
        points = 10  # Fixed points for completing a goal
        user = instance.created_by

        # Award points
        user.points += points
        user.save()

        # Mark the goal as having points awarded
        instance.points_awarded = True
        instance.save()

        logger.info(f"Points awarded to {user.username} for completing goal '{instance.title}'.")


@receiver(post_save, sender=User)
def check_badges(sender, instance, **kwargs):
    """
    Signal to check and award badges based on user points.
    """
    badges = Badge.objects.all()

    for badge in badges:
        if instance.points >= badge.points_required and badge not in instance.badges.all():
            instance.badges.add(badge)  # Award the badge
            logger.info(f"Badge '{badge.name}' awarded to {instance.username}.")


@receiver(post_save, sender=Goal)
def notify_goal_completed(sender, instance, **kwargs):
    """
    Signal to create a notification when a goal is completed.
    """
    if instance.is_completed:
        # Check if a notification for this goal already exists
        notification_exists = Notification.objects.filter(
            user=instance.created_by,
            message=f"🎉 You’ve completed the goal: {instance.title}!"
        ).exists()

        if not notification_exists:
            Notification.objects.create(
                user=instance.created_by,
                message=f"🎉 You’ve completed the goal: {instance.title}!"
            )
            logger.info(f"Notification created for user {instance.created_by.username} for completing goal '{instance.title}'.")


@receiver(post_save, sender=User)
def notify_badge_awarded(sender, instance, **kwargs):
    """
    Signal to create a notification when a badge is awarded.
    """
    badges = Badge.objects.all()

    for badge in badges:
        # Check if the user qualifies for the badge and hasn't been notified
        if instance.points >= badge.points_required and badge in instance.badges.all():
            notification_exists = Notification.objects.filter(
                user=instance,
                message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
            ).exists()

            if not notification_exists:
                Notification.objects.create(
                    user=instance,
                    message=f"🏆 Congratulations! You’ve earned the badge: {badge.name}!"
                )
                logger.info(f"Notification created for user {instance.username} for badge '{badge.name}'.")
