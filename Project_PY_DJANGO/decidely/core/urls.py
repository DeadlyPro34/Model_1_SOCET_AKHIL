from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('choices/', views.choices, name='choices'),
    path('history/', views.history, name='history'),
    path('categories/', views.categories, name='categories'),
    path('insights/', views.insights, name='insights'),
    path('profile/', views.profile, name='profile'),
    path('settings/', views.settings, name='settings'),
]
