from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

from .models import (
    Student, 
    Industry, 
    Skill, 
    Organisation, 
    OrganisationPreference, 
    PreferredField, 
    RequiredSkill, 
    PreferredIndustry, 
    StudentPreference, 
    DesiredSkill, 
    Logbook, 
    Admin
)

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate(self, data):
        if data['first_name'].strip() == "" or data['last_name'].strip() == "":
            raise serializers.ValidationError("First and last names cannot be blank.")
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['industry_id', 'industry_name']

class OrganisationPreferenceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganisationPreference
        fields = ['pref_id', 'pref_education_level', 'positions_available', 'start_date', 'end_date']

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

    def validate(self, data):
        if data['first_name'].strip() == '' or data['last_name'].strip() == '':
            raise serializers.ValidationError("First and last names cannot be blank.")
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['skill_id', 'name']

class OrganisationSerializer(serializers.ModelSerializer):
    industry_name = serializers.CharField(source="industry.industry_name", read_only=True)

    class Meta:
        model = Organisation
        fields = '__all__'

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class OrganisationPreferenceSerializer(serializers.ModelSerializer):
    preferred_fields = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    required_skills = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    organisation_name = serializers.CharField(source='organisation.org_name', read_only=True)
    preferred_fields_names = serializers.SerializerMethodField(read_only=True)
    required_skills_names = serializers.SerializerMethodField(read_only=True)

    organisation = serializers.PrimaryKeyRelatedField(
        queryset=Organisation.objects.all(),
        pk_field=serializers.IntegerField()
    )

    class Meta:
        model = OrganisationPreference
        fields = [
            'pref_id',
            'organisation',
            'organisation_name',
            'pref_education_level',
            'positions_available',
            'start_date',
            'end_date',
            'preferred_fields',
            'required_skills',
            'preferred_fields_names',
            'required_skills_names',
        ]

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date must be before end date.")
        return data

    def create(self, validated_data):
        preferred_fields_data = validated_data.pop('preferred_fields', [])
        required_skills_data = validated_data.pop('required_skills', [])

        preference = OrganisationPreference.objects.create(**validated_data)

        for industry_id in preferred_fields_data:
            try:
                industry = Industry.objects.get(industry_id=industry_id)
                PreferredField.objects.create(preference=preference, field_name=industry.industry_name)
            except Industry.DoesNotExist:
                raise serializers.ValidationError(f"Industry with ID {industry_id} does not exist.")

        for skill_id in required_skills_data:
            try:
                skill = Skill.objects.get(skill_id=skill_id)
                RequiredSkill.objects.create(preference=preference, skill=skill)
            except Skill.DoesNotExist:
                raise serializers.ValidationError(f"Skill with ID {skill_id} does not exist.")

        return preference

    def get_preferred_fields_names(self, obj):
        try:
            return [pf.field_name for pf in obj.preferred_fields.all()]
        except Exception as e:
            print("Error in get_preferred_fields_names:", e)
            return []

    def get_required_skills_names(self, obj):
        try:
            return [rs.skill.name for rs in obj.required_skills.all()]
        except Exception as e:
            print("Error in get_required_skills_names:", e)
            return []

class StudentPreferenceSerializer(serializers.ModelSerializer):
    preferred_industry = serializers.CharField(write_only=True, required=True)
    desired_skill = serializers.CharField(write_only=True, required=True)
    student_id = serializers.CharField(write_only=True)
    student_pref_id = serializers.CharField(read_only=True)

    student_name = serializers.SerializerMethodField(read_only=True)
    industries_details = serializers.SerializerMethodField(read_only=True)
    skills_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentPreference
        fields = [
            'student_pref_id',
            'student_id',            # ✅ only include this, not 'student'
            'student_name',
            'pref_location',
            'available_from',
            'available_to',
            'preferred_industry',
            'desired_skill',
            'industries_details',
            'skills_details',
        ]

    def validate(self, data):
        if data['available_from'] > data['available_to']:
            raise serializers.ValidationError("Available from date must be before available to date.")
        if data['available_from'] < timezone.now().date():
            raise serializers.ValidationError("Available from date cannot be in the past.")
        return data

    def create(self, validated_data):
        # Extract and resolve student
        student_id = validated_data.pop("student_id", None)
        if not student_id:
            raise serializers.ValidationError({"student_id": "This field is required."})

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            raise serializers.ValidationError({"student_id": f"Student {student_id} does not exist."})

        # Extract other custom fields
        industry_id = validated_data.pop('preferred_industry', None)
        skill_id = validated_data.pop('desired_skill', None)

        # Create the preference object with actual student
        preference = StudentPreference.objects.create(student=student, **validated_data)

        # Save preferred industry
        if industry_id:
            try:
                industry = Industry.objects.get(industry_id=industry_id)
                PreferredIndustry.objects.create(student=preference, industry=industry)
            except Industry.DoesNotExist:
                raise serializers.ValidationError(f"Industry with ID {industry_id} does not exist.")

        # Save desired skill
        if skill_id:
            try:
                skill = Skill.objects.get(skill_id=skill_id)
                DesiredSkill.objects.create(student_pref=preference, skill=skill)
            except Skill.DoesNotExist:
                raise serializers.ValidationError(f"Skill with ID {skill_id} does not exist.")

        return preference

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_industries_details(self, obj):
        return [
            {"industry_id": i.industry.industry_id, "industry_name": i.industry.industry_name}
            for i in obj.preferredindustry_set.select_related("industry").all()
        ]

    def get_skills_details(self, obj):
        return [
            {"skill_id": s.skill.skill_id, "skill_name": s.skill.name}
            for s in obj.desiredskill_set.select_related("skill").all()
        ]

    
class PreferredFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferredField
        fields = '__all__'

class RequiredSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredSkill
        fields = '__all__'

class LogbookSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Logbook
        fields = ['logbook_id', 'student_id', 'student_name', 'org_id', 'week_number', 
                 'log_entry', 'submitted_at', 'status', 'viewed_at']

    def validate(self, data):
        if not data['log_entry'].strip():
            raise serializers.ValidationError("Log entry cannot be empty.")
        if len(data['log_entry'].strip().split()) > 300:
            raise serializers.ValidationError("Log entry cannot exceed 300 words.")
        return data

    def get_student_name(self, obj):
        return f"{obj.student_id.first_name} {obj.student_id.last_name}"

class OrganisationWithPreferenceSerializer(serializers.ModelSerializer):
    organisation_preference = serializers.SerializerMethodField()

    class Meta:
        model = Organisation
        fields = '__all__'

    def get_organisation_preference(self, obj):
        preference = obj.preferences.first()
        if preference:
            return {
                "required_skills_names": [rs.skill.name for rs in preference.required_skills.all()],
                "preferred_fields_names": [pf.field_name for pf in preference.preferred_fields.all()]
            }
        return {}