from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('choices/', views.choices, name='choices'),
    path('choices/add/', views.add_choice, name='add_choice'),
    path('choices/delete/<int:choice_id>/', views.delete_choice, name='delete_choice'),
    path('api/save-decision/', views.save_decision, name='save_decision'),
    path('history/', views.history, name='history'),
    path('history/export/', views.export_csv, name='export_csv'),
    path('categories/', views.categories, name='categories'),
    path('categories/add/', views.add_category, name='add_category'),
    path('categories/delete/<int:category_id>/', views.delete_category, name='delete_category'),
    path('insights/', views.insights, name='insights'),
    path('profile/', views.profile, name='profile'),
    path('settings/', views.settings, name='settings'),
    path('settings/save/', views.save_settings, name='save_settings'),
    path('settings/reset/', views.reset_workspace, name='reset_workspace'),
]
