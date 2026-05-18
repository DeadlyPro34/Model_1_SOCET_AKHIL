from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Choice(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='choices')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class DecisionHistory(models.Model):
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name='decisions')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='decisions')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Selected '{self.selected_choice.name}' on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name_plural = "Decision Histories"


class Settings(models.Model):
    theme = models.CharField(max_length=10, default='light')
    notifications = models.BooleanField(default=True)

    def __str__(self):
        return f"Settings (Theme: {self.theme}, Notifications: {self.notifications})"

    class Meta:
        verbose_name_plural = "Settings"

