# Generated by Django 5.1.7 on 2025-04-12 08:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_admin'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentMatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('matched_at', models.DateTimeField(auto_now_add=True)),
                ('admin_note', models.TextField(blank=True, null=True)),
                ('organisation', models.ForeignKey(help_text='The organisation matched with the student', on_delete=django.db.models.deletion.CASCADE, to='users.organisation')),
                ('student_preference', models.OneToOneField(help_text='The student preference that has been matched', on_delete=django.db.models.deletion.CASCADE, related_name='match', to='users.studentpreference')),
            ],
        ),
    ]
