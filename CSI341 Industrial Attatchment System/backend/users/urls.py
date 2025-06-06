from django.urls import path
from .views import register_user
from .views import (
    register_student,
    login_student,
    create_student_preference,
    get_industries,
    get_skills,
    register_organisation,
    login_organisation,
    add_preferred_field,
    add_required_skill,
    list_organisation_preferences,
    create_organisation_preference,
    create_logbook_entry,
    get_org_id_by_name,
    register_admin,
    login_admin,
    list_all_students,
    manage_student,
    list_all_organisations,
    manage_organisation,
    manual_match,
    preference_list,
    update_student_preference,
    update_organisation_preference,
    change_password,
    update_student_profile,
    update_organisation_profile,
    change_org_password,
    get_logbook_detail,
    get_org_logbooks,
    mark_logbook_viewed,
   
    
    
)
from django.views.generic import TemplateView

urlpatterns = [
    path('register/', register_user, name='register_user'),

    # Student Routes
    path('register/student/', register_student, name='register_student'),
    path('login/student/', login_student, name='login_student'),
    path('student-preference/', create_student_preference, name='create_student_preference'),

    # Organisation Routes
    path('register-organisation/', register_organisation, name='register_organisation'),
    path('login-organisation/', login_organisation, name='login_organisation'),
    path('organisation/<int:org_id>/preferences/', list_organisation_preferences, name='list_organisation_preferences'),
    path('organisation/<int:org_id>/preferences/create/', create_organisation_preference, name='create_organisation_preference'),
    path('organisation/preferences/preferred-field/', add_preferred_field, name='add_preferred_field'),
    path('organisation/preferences/required-skill/', add_required_skill, name='add_required_skill'),

    # Master Data Routes
    path('industries/', get_industries, name='get_industries'),
    path('skills/', get_skills, name='get_skills'),

    # Optional frontend entry point
    path('dashboard/', TemplateView.as_view(template_name="index.html"), name='dashboard'),
    path('logbook/', create_logbook_entry, name='logbook'),
    path('get-org-id-by-name/', get_org_id_by_name, name='get_org_id_by_name'),

    path('admin/register/', register_admin, name='register_admin'),
    path('admin/login/', login_admin, name='login_admin'),
    
    path('admin/students/', list_all_students, name='list_all_students'),
    path('admin/students/<str:student_id>/', manage_student, name='manage_student'),
    
    path('admin/organisations/', list_all_organisations, name='list_all_organisations'),
    path('admin/organisations/<int:org_id>/', manage_organisation, name='manage_organisation'),
    path('manual-match/', manual_match, name='manual_match'),
    path('admin/student-preferences/', preference_list, name='student_preference_list'),
    path('student-preferences/', preference_list, name='student_preference_list'),
    path('student-preference/<str:student_pref_id>/', update_student_preference, name='update_student_preference'),
    path('organisation-preference/<int:pref_id>/', update_organisation_preference, name='update_organisation_preference'),
    path('update_student_profile/<str:student_id>/',update_student_profile, name='update_student_profile'), 
    path('change-password/<str:student_id>/', change_password, name='change-password'),
    path('update_organisation_profile/<int:org_id>/', update_organisation_profile, name='update_organisation_profile'),
    path('change-password/<str:student_id>/', change_password, name='change_password'),
    path('change-organisation-password/<int:org_id>/', change_org_password, name='change_org_password'),
    path('organisation/<int:org_id>/logbooks/', get_org_logbooks, name='org_logbooks'),
    path('logbooks/<str:logbook_id>/', get_logbook_detail, name='logbook_detail'),
    path('logbooks/<str:logbook_id>/mark-viewed/', mark_logbook_viewed, name='mark_logbook_viewed'),
    
    
    


]
    

    
