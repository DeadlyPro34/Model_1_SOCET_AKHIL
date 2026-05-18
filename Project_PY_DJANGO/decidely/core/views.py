from django.shortcuts import render, redirect, get_object_or_404
from .models import Category, Choice

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
    return render(request, 'history.html')

def categories(request):
    return render(request, 'categories.html')

def insights(request):
    return render(request, 'insights.html')

def profile(request):
    return render(request, 'profile.html')

def settings(request):
    return render(request, 'settings.html')


