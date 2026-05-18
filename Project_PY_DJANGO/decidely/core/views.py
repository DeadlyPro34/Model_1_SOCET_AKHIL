from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db.models import Count
from django.utils import timezone
import json
import csv
from django.contrib.auth.models import User
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
    total_decisions = DecisionHistory.objects.count()
    recent_history = DecisionHistory.objects.select_related('selected_choice', 'category').order_by('-timestamp')[:5]
    total_categories = Category.objects.count()
    
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_decisions = DecisionHistory.objects.filter(timestamp__gte=today_start).count()

    return render(request, 'dashboard.html', {
        'choices': all_choices,
        'total_decisions': total_decisions,
        'recent_history': recent_history,
        'today_decisions': today_decisions,
        'total_categories': total_categories
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
    categories_list = Category.objects.all().order_by('name')
    
    return render(request, 'history.html', {
        'history': history_records,
        'total_count': total_count,
        'today_count': today_count,
        'categories': categories_list
    })

def categories(request):
    categories_list = Category.objects.annotate(choice_count=Count('choice')).order_by('name')
    return render(request, 'categories.html', {'categories': categories_list})

@require_POST
def add_category(request):
    name = request.POST.get('name')
    if not name:
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                name = data.get('name')
            except json.JSONDecodeError:
                return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    
    if name:
        name = name.strip()
        if name:
            if Category.objects.filter(name__iexact=name).exists():
                return JsonResponse({'status': 'error', 'message': 'Category already exists!'})
            
            category = Category.objects.create(name=name)
            return JsonResponse({
                'status': 'success',
                'message': 'Category created successfully!',
                'category': {
                    'id': category.id,
                    'name': category.name,
                    'choice_count': 0
                }
            })
    return JsonResponse({'status': 'error', 'message': 'Category name cannot be empty'}, status=400)

@require_POST
def delete_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    category.delete()
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
        return JsonResponse({'status': 'success', 'message': 'Category deleted successfully!'})
    return redirect('core:categories')

def insights(request):
    total_decisions = DecisionHistory.objects.count()
    
    # 1. Most selected choice
    most_selected = DecisionHistory.objects.values('selected_choice__name').annotate(count=Count('selected_choice')).order_by('-count').first()
    if most_selected:
        most_selected_choice_name = most_selected['selected_choice__name']
        most_selected_choice_count = most_selected['count']
    else:
        most_selected_choice_name = 'N/A'
        most_selected_choice_count = 0

    # 2. Favorite Category
    fav_cat = DecisionHistory.objects.values('category__name').annotate(count=Count('category')).order_by('-count').first()
    if fav_cat and total_decisions > 0:
        favorite_category_name = fav_cat['category__name']
        favorite_category_pct = int(fav_cat['count'] * 100 / total_decisions)
    else:
        favorite_category_name = 'N/A'
        favorite_category_pct = 0

    # 3. Weekly performance
    seven_days_ago = timezone.now() - timezone.timedelta(days=7)
    weekly_decisions = DecisionHistory.objects.filter(timestamp__gte=seven_days_ago).count()
    avg_decisions_per_day = round(weekly_decisions / 7.0, 1)
    time_saved_minutes = weekly_decisions * 2

    # 4. Category distribution for Chart.js
    cat_counts = DecisionHistory.objects.values('category__name').annotate(count=Count('category')).order_by('-count')
    category_labels = [item['category__name'] for item in cat_counts]
    category_data = [item['count'] for item in cat_counts]

    return render(request, 'insights.html', {
        'total_decisions': total_decisions,
        'most_selected_choice_name': most_selected_choice_name,
        'most_selected_choice_count': most_selected_choice_count,
        'favorite_category_name': favorite_category_name,
        'favorite_category_pct': favorite_category_pct,
        'weekly_decisions': weekly_decisions,
        'avg_decisions_per_day': avg_decisions_per_day,
        'time_saved_minutes': time_saved_minutes,
        'category_labels': category_labels,
        'category_data': category_data
    })

def profile(request):
    if request.method == 'POST':
        # Handle both JSON fetch and standard Form post
        if request.content_type == 'application/json':
            import json
            try:
                data = json.loads(request.body)
                first_name = data.get('first_name', '').strip()
                last_name = data.get('last_name', '').strip()
                email = data.get('email', '').strip()
                password = data.get('password', '').strip()
            except json.JSONDecodeError:
                return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        else:
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            email = request.POST.get('email', '').strip()
            password = request.POST.get('password', '').strip()

        if request.user.is_authenticated:
            user = request.user
        else:
            user, _ = User.objects.get_or_create(username='demo_user', defaults={'email': 'john.doe@example.com'})
            
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
            return JsonResponse({
                'status': 'success',
                'message': 'Profile saved successfully!',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
            })
        return redirect('core:profile')
        
    if request.user.is_authenticated:
        user = request.user
    else:
        user, _ = User.objects.get_or_create(username='demo_user', defaults={'email': 'john.doe@example.com', 'first_name': 'John', 'last_name': 'Doe'})
        
    return render(request, 'profile.html', {'user': user})

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
                reduced_motion = data.get('reduced_motion', False)
            except json.JSONDecodeError:
                return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        else:
            theme = 'dark' if request.POST.get('theme') == 'dark' else 'light'
            notifications = True if request.POST.get('notifications') in ['true', 'on'] else False
            reduced_motion = True if request.POST.get('reduced_motion') in ['true', 'on'] else False
        
        settings, _ = Settings.objects.get_or_create(pk=1)
        settings.theme = theme
        settings.notifications = notifications
        settings.reduced_motion = reduced_motion
        settings.save()
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest' or request.content_type == 'application/json':
            return JsonResponse({
                'status': 'success',
                'message': 'Settings saved successfully!',
                'theme': settings.theme,
                'notifications': settings.notifications,
                'reduced_motion': settings.reduced_motion
            })
            
    return redirect('core:settings')

from django.views.decorators.http import require_POST

@require_POST
def reset_workspace(request):
    DecisionHistory.objects.all().delete()
    Choice.objects.all().delete()
    return JsonResponse({'status': 'success', 'message': 'Workspace reset completed successfully!'})

def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="decidely_resolutions_history.csv"'

    writer = csv.writer(response)
    writer.writerow(['Choice Pool (Category)', 'Outcome (Choice Name)', 'Timestamp (UTC)', 'Method'])

    records = DecisionHistory.objects.select_related('selected_choice', 'category').all().order_by('-timestamp')
    for record in records:
        writer.writerow([
            record.category.name,
            record.selected_choice.name,
            record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'WHEEL SPIN'
        ])

    return response


