# Generated by Django 5.1.7 on 2025-04-13 12:41

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_logbook_week_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='student_id',
            field=models.CharField(max_length=9, primary_key=True, serialize=False, unique=True, validators=[django.core.validators.RegexValidator(message='Student ID must start with a year between 2015 and 2022 and be 9 digits long.', regex='^(201[5-9]|202[0-2])\\d{5}$')]),
        ),
    ]
