# Generated by Django 5.1.4 on 2025-01-12 19:34

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0004_goal_points_awarded'),
    ]

    operations = [
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('points_required', models.IntegerField()),
                ('users', models.ManyToManyField(related_name='badges', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
