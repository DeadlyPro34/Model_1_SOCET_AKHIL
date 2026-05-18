from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Category, Choice, DecisionHistory, Settings

def dashboard(request):
    # Initialize default categories if none exist (beginner-friendly fallback)
    if not Category.objects.exists():
        Category.objects.create(name="Food & Dining")
        Category.objects.create(name="Health")
        Category.objects.create(name="Entertainment")
        Category.objects.create(name="Work")
        Category.objects.create(name="Other")

    # Initialize default choices if none exist so the wheel isn't blank
    if not Choice.objects.exists():
        food = Category.objects.get(name="Food & Dining")
        Choice.objects.create(name="Pizza Hut", category=food)
        Choice.objects.create(name="Taco Bell", category=food)
        Choice.objects.create(name="Subway", category=food)
        Choice.objects.create(name="Salad Bar", category=food)
        Choice.objects.create(name="Sushi Zen", category=food)
        Choice.objects.create(name="Pasta Co", category=food)

    all_choices = Choice.objects.all()
    return render(request, 'dashboard.html', {
        'choices': all_choices
    })

@csrf_exempt
def save_decision(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            choice_name = data.get('choice_name')
            
            if choice_name:
                # Find the choice in DB. If not found, use or create one in the default category
                choice = Choice.objects.filter(name=choice_name).first()
                if not choice:
                    default_cat, _ = Category.objects.get_or_create(name="Other")
                    choice = Choice.objects.create(name=choice_name, category=default_cat)
                
                # Save into DecisionHistory
                DecisionHistory.objects.create(
                    selected_choice=choice,
                    category=choice.category
                )
                
                return JsonResponse({'status': 'success', 'message': 'Decision saved successfully!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Choice name is required.'}, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON.'}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Only POST method allowed.'}, status=405)

def choices(request):

    # Initialize default categories if none exist (beginner-friendly fallback)
    if not Category.objects.exists():
        Category.objects.create(name="Food & Dining")
        Category.objects.create(name="Health")
        Category.objects.create(name="Entertainment")
        Category.objects.create(name="Work")
        Category.objects.create(name="Other")

    all_choices = Choice.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    
    return render(request, 'choices.html', {
        'choices': all_choices,
        'categories': categories
    })

def add_choice(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        category_id = request.POST.get('category')
        
        if name and category_id:
            category = get_object_or_404(Category, id=category_id)
            Choice.objects.create(name=name, category=category)
            
    return redirect('core:choices')

def delete_choice(request, choice_id):
    choice = get_object_or_404(Choice, id=choice_id)
    choice.delete()
    return redirect('core:choices')

def history(request):
    from django.utils import timezone
    history_records = DecisionHistory.objects.all().order_by('-timestamp')
    total_count = history_records.count()
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_count = history_records.filter(timestamp__gte=today_start).count()
    
    return render(request, 'history.html', {
        'history': history_records,
        'total_count': total_count,
        'today_count': today_count
    })

def categories(request):
    return render(request, 'categories.html')

def insights(request):
    return render(request, 'insights.html')

def profile(request):
    return render(request, 'profile.html')

def settings(request):
    return render(request, 'settings.html')

def save_settings(request):
    if request.method == 'POST':
        # Handle both JSON fetch requests and standard form posts
        if request.content_type == 'application/json':
            import json
            try:
                data = json.loads(request.body)
                theme = data.get('theme', 'light')
                notifications = data.get('notifications', False)
            except json.JSONDecodeError:
                return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        else:
            theme = 'dark' if request.POST.get('theme') == 'dark' else 'light'
            notifications = True if request.POST.get('notifications') in ['true', 'on'] else False
        
        settings, _ = Settings.objects.get_or_create(pk=1)
        settings.theme = theme
        settings.notifications = notifications
        settings.save()
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
            return JsonResponse({
                'status': 'success',
                'message': 'Settings saved successfully!',
                'theme': settings.theme,
                'notifications': settings.notifications
            })
            
    return redirect('core:settings')

from django.views.decorators.http import require_POST

@require_POST
def reset_workspace(request):
    DecisionHistory.objects.all().delete()
    Choice.objects.all().delete()
    return JsonResponse({'status': 'success', 'message': 'Workspace reset completed successfully!'})


