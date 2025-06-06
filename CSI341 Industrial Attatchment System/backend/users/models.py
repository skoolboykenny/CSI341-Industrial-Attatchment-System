from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator, EmailValidator
from django.utils import timezone
import random
import string

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

def generate_preference_id(student_id):
    from .models import StudentPreference
    existing = StudentPreference.objects.filter(student__student_id=student_id).count() + 1
    return f"{student_id}_PREF{existing:03d}"

class Student(models.Model):
    student_id = models.CharField(
        max_length=9,
        unique=True,
        primary_key=True,
        validators=[
            RegexValidator(
                regex=r'^(201[5-9]|202[0-2])\d{5}$',
                message="Student ID must start with a year between 2015 and 2022 and be 9 digits long."
            )
        ]
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    year_of_study = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)])
    student_email = models.EmailField(unique=True, validators=[EmailValidator()])
    student_contact_number = models.CharField(
        max_length=15,
        unique=True,
        validators=[RegexValidator(r'^\+?7\d{6,14}$', message="Phone number must start with 7 and contain 7 to 15 digits.")]
    )
    password = models.CharField(max_length=255)

    def clean(self):
        if self.first_name.strip() == "" or self.last_name.strip() == "":
            raise ValidationError("First and last names cannot be blank.")

class Industry(models.Model):
    industry_id = models.CharField(primary_key=True, max_length=20)
    industry_name = models.CharField(max_length=100)

class Skill(models.Model):
    skill_id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=100)

class StudentPreference(models.Model):
    student_pref_id = models.CharField(primary_key=True, max_length=30)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    pref_location = models.CharField(max_length=100)
    available_from = models.DateField()
    available_to = models.DateField()
    industries = models.ManyToManyField(Industry, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    
    def clean(self):
        if self.available_from > self.available_to:
            raise ValidationError("Available from date must be before available to date.")
        if self.available_from < timezone.now().date():
            raise ValidationError("Available from date cannot be in the past.")
    
    def save(self, *args, **kwargs):
        if not self.student_pref_id:
            self.student_pref_id = generate_preference_id(self.student.student_id)
        self.full_clean()  # Validates the instance and raises ValidationError if needed.
        super().save(*args, **kwargs)

class Organisation(models.Model):
    org_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=255)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE)
    town = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    plot_number = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15,
        unique=True,
        validators=[RegexValidator(r'^\+?7\d{6,14}$', message="Phone number must start with 7 and contain 7 to 15 digits.")])
    contact_email = models.EmailField(unique=True, validators=[EmailValidator()])
    password = models.CharField(max_length=255)

class Location(models.Model):
    id = models.AutoField(primary_key=True)
    town = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    plot_no = models.CharField(max_length=50)

    class Meta:
        unique_together = ('street', 'plot_no')

    def clean(self):
        if self.plot_no.strip().startswith("-"):
            raise ValidationError("Plot number cannot be negative.")

class OrganisationPreference(models.Model):
    pref_id = models.AutoField(primary_key=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='preferences')
    pref_education_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)])
    positions_available = models.IntegerField(validators=[MinValueValidator(1)])
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        errors = {}
        if self.start_date > self.end_date:
            errors["start_date"] = "Start Date must be before End Date."
            errors["end_date"] = "Start Date must be before End Date."
        if self.start_date < timezone.now().date():
            errors["start_date"] = "Start date cannot be in the past."
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class PreferredField(models.Model):
    field_id = models.AutoField(primary_key=True)
    preference = models.ForeignKey(OrganisationPreference, on_delete=models.CASCADE, related_name='preferred_fields')
    field_name = models.CharField(max_length=100)

class RequiredSkill(models.Model):
    id = models.AutoField(primary_key=True)
    preference = models.ForeignKey(OrganisationPreference, on_delete=models.CASCADE, related_name='required_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('preference', 'skill')

class PreferredIndustry(models.Model):
    student = models.ForeignKey(StudentPreference, on_delete=models.CASCADE)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'industry')

class DesiredSkill(models.Model):
    student_pref = models.ForeignKey(StudentPreference, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student_pref', 'skill')

def generate_random_logbook_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class Logbook(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('viewed', 'Viewed'),
    ]

    logbook_id = models.CharField(max_length=8, primary_key=True, default=generate_random_logbook_id, editable=False)
    student_id = models.ForeignKey('Student', to_field='student_id', on_delete=models.CASCADE)
    org_id = models.ForeignKey('Organisation', to_field='org_id', on_delete=models.CASCADE)
    week_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    log_entry = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    viewed_at = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if not self.log_entry.strip():
            raise ValidationError("Log entry cannot be empty.")
        if len(self.log_entry.strip().split()) > 300:
            raise ValidationError("Log entry cannot exceed 300 words.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Logbook entry for {self.student_id} Week {self.week_number}"

@receiver(pre_save, sender=Logbook)
def set_logbook_id(sender, instance, **kwargs):
    if not instance.logbook_id:
        instance.logbook_id = generate_random_logbook_id()

class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if self.first_name.strip() == '' or self.last_name.strip() == '':
            raise ValidationError("First and last names cannot be blank.")

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class StudentMatch(models.Model):
    student_preference = models.OneToOneField(
        StudentPreference,
        on_delete=models.CASCADE,
        related_name="match",
        help_text="The student preference that has been manually matched"
    )
    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.CASCADE,
        help_text="The organisation matched to the student"
    )
    matched_at = models.DateTimeField(auto_now_add=True)
    admin_note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Match: {self.student_preference.student.student_id} with {self.organisation.org_name}"
