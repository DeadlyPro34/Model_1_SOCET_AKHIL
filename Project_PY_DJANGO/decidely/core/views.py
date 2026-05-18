from django.shortcuts import render

def dashboard(request):
    return render(request, 'dashboard.html')

def choices(request):
    return render(request, 'choices.html')

def history(request):
    return render(request, 'history.html')

def categories(request):
    return render(request, 'categories.html')

def insights(request):
    return render(request, 'insights.html')

def profile(request):
    return render(request, 'profile.html')

def settings(request):
    return render(request, 'settings.html')

