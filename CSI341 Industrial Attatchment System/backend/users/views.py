from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password,make_password
from .models import Student
import traceback
from django.utils import timezone
from .serializers import StudentSerializer,IndustrySerializer,SkillSerializer,OrganisationSerializer,OrganisationPreferenceSerializer,RequiredSkillSerializer,PreferredFieldSerializer,LogbookSerializer,AdminSerializer,OrganisationWithPreferenceSerializer,StudentPreferenceSerializer
from .models import Student, StudentPreference,Skill,DesiredSkill,PreferredIndustry,Industry,generate_preference_id,Organisation,Location,OrganisationPreference,Logbook,Admin,StudentMatch
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from .serializers import UserSerializer
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def register_user(request):
    try:
        data = request.data
        # Check if username or email already exists
        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already taken"}, status=400)
        if User.objects.filter(email=data['email']).exists():
            return Response({"error": "Email already registered"}, status=400)
        # Hash password before saving
        data['password'] = make_password(data['password'])
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)    




@api_view(['POST'])
def register_student(request):
    try:
        data = request.data

        # Check if student_id or phone number already exists
        if Student.objects.filter(student_id=data['student_id']).exists():
            return Response({"error": "Student ID already registered"}, status=400)

        if Student.objects.filter(student_contact_number=data['student_contact_number']).exists():
            return Response({"error": "Phone number already registered"}, status=400)

        serializer = StudentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student registered successfully"}, status=201)

        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def login_student(request):
    student_id = request.data.get("student_id")
    password = request.data.get("password")
    try:
        student = Student.objects.get(student_id=student_id)
        if check_password(password, student.password):
            return Response({"message": "Student login successful"}, status=200)
        else:
            return Response({"error": "Invalid credentials"}, status=400)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    
@api_view(['GET'])    
def preference_list(request):
    prefs = StudentPreference.objects.select_related('student').all()
    data = []
    for pref in prefs:
        data.append({
            "id": pref.student_pref_id,
            "student": pref.student.last_name,
            "pref_location": pref.pref_location,
            "available_from": pref.available_from,
            "available_to": pref.available_to,
        })
    return JsonResponse(data, safe=False)

@api_view(['POST'])
def create_student_preference(request):
    serializer = StudentPreferenceSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({"message": "Preference created successfully."}, status=201)
        except ValidationError as e:
            return Response(e.message_dict, status=400)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)
    else:
        print("Validation Error:", serializer.errors)  # ✅ log it to console
        return Response(serializer.errors, status=400)
def get_industries(request):
    data = list(Industry.objects.values("industry_id", "industry_name"))
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def get_skills(request):
    skills = Skill.objects.all()
    serializer = SkillSerializer(skills, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def register_organisation(request):
    try:
        data = request.data
        required_fields = ['org_name', 'industry', 'town', 'street', 'plot_number', 'contact_number', 'contact_email', 'password']

        for field in required_fields:
            if field not in data or data[field] == '':
                return Response({"error": f"{field} is a required field"}, status=status.HTTP_400_BAD_REQUEST)

        # Check for duplicates
        if Organisation.objects.filter(contact_email=data['contact_email']).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        if Organisation.objects.filter(org_name=data['org_name']).exists():
            return Response({"error": "Organisation already registered"}, status=status.HTTP_400_BAD_REQUEST)

        if Organisation.objects.filter(contact_number=data['contact_number']).exists():
            return Response({"error": "Organisation contact already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the industry_id
        try:
            industry = Industry.objects.get(industry_id=data['industry'])
        except Industry.DoesNotExist:
            return Response({"error": "Invalid industry selected"}, status=status.HTTP_400_BAD_REQUEST)

        # Create location
        Location.objects.create(
            town=data['town'],
            street=data['street'],
            plot_no=data['plot_number']
        )

        # Prepare and save organisation
        org_data = {
            'org_name': data['org_name'],
            'industry': industry.pk,
            'town': data['town'],
            'street': data['street'],
            'plot_number': data['plot_number'],
            'contact_number': data['contact_number'],
            'contact_email': data['contact_email'],
            'password': data['password'],  # will be hashed in serializer
        }

        serializer = OrganisationSerializer(data=org_data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Organisation registered successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Organisation Login
@api_view(['POST'])
def login_organisation(request):
    contact_email = request.data.get("contact_email")
    password = request.data.get("password")

    try:
        organisation = Organisation.objects.get(contact_email=contact_email)

        if check_password(password, organisation.password):
            return Response({
                "message": "Organisation login successful",
                "organisation_id": organisation.org_id  # ✅ This line is needed!
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    except Organisation.DoesNotExist:
        return Response({"error": "Organisation not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_organisation_preference(request, org_id):
    serializer = OrganisationPreferenceSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({"message": "Organisation preference created successfully."}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the exception here as needed
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List Preferences for Specific Organisation
@api_view(['GET'])
def list_organisation_preferences(request, org_id):
    try:
        preferences = OrganisationPreference.objects.filter(organisation_id=org_id)
        serializer = OrganisationPreferenceSerializer(preferences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Add Preferred Field
@api_view(['POST'])
def add_preferred_field(request):
    try:
        serializer = PreferredFieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Preferred field added"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Add Required Skill
@api_view(['POST'])
def add_required_skill(request):
    try:
        serializer = RequiredSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Required skill added"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
def create_logbook_entry(request):
    if request.method == 'POST':
        try:
            data = request.data
            required_fields = ['student_id', 'org_id', 'week_number', 'log_entry']
            for field in required_fields:
                if field not in data:
                    return Response({"error": f"{field} is a required field."}, status=status.HTTP_400_BAD_REQUEST)

            if not Student.objects.filter(student_id=data['student_id']).exists():
                return Response({"error": "Student ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            if not Organisation.objects.filter(org_id=data['org_id']).exists():
                return Response({"error": "Organisation ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = LogbookSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'GET':
        logs = Logbook.objects.all()
        serializer = LogbookSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_org_id_by_name(request):
    name = request.GET.get("name")
    try:
        org = Organisation.objects.get(org_name=name)
        return Response({"org_id": org.org_id})
    except Organisation.DoesNotExist:
        return Response({"error": "Organisation not found."}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def register_admin(request):
    try:
        data = request.data
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)

        if Admin.objects.filter(email=data['email']).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdminSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Admin registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_admin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        admin = Admin.objects.get(email=email)
        if check_password(password, admin.password):
            admin.last_login = timezone.now()
            admin.save()
            return Response({
                "message": "Login successful",
                "admin_id": admin.admin_id,
                "email": admin.email
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
# Add to views.py
@api_view(['GET', 'PUT', 'DELETE'])
def manage_student(request, student_id):
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in request.data:
                serializer.validated_data['password'] = make_password(request.data['password'])
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student.delete()
        return Response({"message": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def list_all_students(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


# Add to views.py
@api_view(['GET', 'PUT', 'DELETE'])
def manage_organisation(request, org_id):
    try:
        org = Organisation.objects.get(org_id=org_id)
    except Organisation.DoesNotExist:
        return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrganisationSerializer(org)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = OrganisationSerializer(org, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in request.data:
                serializer.validated_data['password'] = make_password(request.data['password'])
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        org.delete()
        return Response({"message": "Organization deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def list_all_organisations(request):
    orgs = Organisation.objects.select_related('industry').all()
    serializer = OrganisationWithPreferenceSerializer(orgs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def manual_match(request):
    """
    Expected JSON payload:
    {
      "student_pref_id": "202201202_PREF001",
      "organisation_id": 3,
      "admin_note": "Matched via drag-and-drop"
    }
    """
    try:
        student_pref_id = request.data.get("student_pref_id")
        organisation_id = request.data.get("organisation_id")
        admin_note = request.data.get("admin_note", "")
        
        if not student_pref_id or not organisation_id:
            return Response(
                {"error": "Both student_pref_id and organisation_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        student_pref = StudentPreference.objects.get(student_pref_id=student_pref_id)
        organisation = Organisation.objects.get(org_id=organisation_id)
        
        match, created = StudentMatch.objects.update_or_create(
            student_preference=student_pref,
            defaults={"organisation": organisation, "admin_note": admin_note}
        )
        msg = "Match created successfully." if created else "Match updated successfully."
        return Response({"message": msg, "match_id": match.pk}, status=status.HTTP_200_OK)
        
    except StudentPreference.DoesNotExist:
        return Response({"error": "Student preference not found."}, status=status.HTTP_404_NOT_FOUND)
    except Organisation.DoesNotExist:
        return Response({"error": "Organisation not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": "Server error: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def preference_list(request):
    prefs = StudentPreference.objects.select_related('student').prefetch_related(
        'preferredindustry_set__industry',
        'desiredskill_set__skill'
    ).all()
    serializer = StudentPreferenceSerializer(prefs, many=True)
    return Response(serializer.data)
@api_view(['PUT'])
def update_student_preference(request, student_pref_id):
    try:
        pref = StudentPreference.objects.get(student_pref_id=student_pref_id)
    except StudentPreference.DoesNotExist:
        return Response({"error": "Preference not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentPreferenceSerializer(pref, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_organisation_preference(request, pref_id):
    try:
        preference = OrganisationPreference.objects.get(pref_id=pref_id)
    except OrganisationPreference.DoesNotExist:
        return Response({"error": "Organisation preference not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrganisationPreferenceSerializer(preference, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def update_student_profile(request, student_id):
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def change_password(request, student_id):
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({'error': 'Current and new password must be provided'}, status=status.HTTP_400_BAD_REQUEST)

    if not student.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    student.set_password(new_password)
    student.save()

    return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT'])
def update_organisation_profile(request, org_id):
    print("Received org_id:", org_id)
    try:
        org = Organisation.objects.get(org_id=org_id)
    except Organisation.DoesNotExist:
        return Response({'error': 'Organisation not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrganisationSerializer(org)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = OrganisationSerializer(org, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def change_org_password(request, org_id):
    try:
        org = Organisation.objects.get(org_id=org_id)
    except Organisation.DoesNotExist:
        return Response({'error': 'Organisation not found'}, status=status.HTTP_404_NOT_FOUND)

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({'error': 'Current and new password must be provided'}, status=status.HTTP_400_BAD_REQUEST)

    if not check_password(current_password, org.password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    org.password = make_password(new_password)
    org.save()

    return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_org_logbooks(request, org_id):
    """Get all logbooks for an organization"""
    try:
        logbooks = Logbook.objects.filter(org_id=org_id).order_by('-submitted_at')
        serializer = LogbookSerializer(logbooks, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_logbook_detail(request, logbook_id):
    """Get details of a specific logbook"""
    try:
        logbook = Logbook.objects.get(logbook_id=logbook_id)
        serializer = LogbookSerializer(logbook)
        return Response(serializer.data)
    except Logbook.DoesNotExist:
        return Response({"error": "Logbook not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def mark_logbook_viewed(request, logbook_id):
    """Mark a logbook as viewed by the organization"""
    try:
        logbook = Logbook.objects.get(logbook_id=logbook_id)
        logbook.status = 'viewed'
        logbook.viewed_at = timezone.now()
        logbook.save()
        serializer = LogbookSerializer(logbook)
        return Response(serializer.data)
    except Logbook.DoesNotExist:
        return Response({"error": "Logbook not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_student_preferences(request, student_id):
    preferences = StudentPreference.objects.filter(student__student_id=student_id)
    serializer = StudentPreferenceSerializer(preferences, many=True)
    return Response(serializer.data)

