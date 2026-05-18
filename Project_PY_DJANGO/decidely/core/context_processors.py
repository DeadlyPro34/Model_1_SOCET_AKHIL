from .models import Settings

def global_settings(request):
    settings, _ = Settings.objects.get_or_create(pk=1)
    return {'app_settings': settings}
