function handleReset() {
    const confirmed = confirm("Warning: This will permanently delete all your data. Are you absolutely sure?");
    if (confirmed) {
        console.log("Data reset initiated...");
        // In a real app, this would trigger an API call.
    }
}

// Premium Toast Alert system for real-time visual feedback
function showToast(message, type = 'success') {
    // Remove existing toast if present
    const existingToast = document.getElementById('settings-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'settings-toast';
    
    // Premium sleek glassmorphism style classes
    toast.className = 'fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0';
    
    // Style according to type
    let bgClass = '';
    let icon = '';
    if (type === 'success') {
        bgClass = 'bg-emerald-500/95 dark:bg-emerald-600/95 backdrop-blur-md text-white border border-emerald-400/20';
        icon = '<i class="fa-solid fa-circle-check text-base"></i>';
    } else if (type === 'info') {
        bgClass = 'bg-slate-800/95 dark:bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/20';
        icon = '<i class="fa-solid fa-circle-notch fa-spin text-base"></i>';
    } else if (type === 'error') {
        bgClass = 'bg-rose-500/95 dark:bg-rose-600/95 backdrop-blur-md text-white border border-rose-400/20';
        icon = '<i class="fa-solid fa-circle-xmark text-base"></i>';
    } else {
        bgClass = 'bg-amber-500/95 dark:bg-amber-600/95 backdrop-blur-md text-white border border-amber-400/20';
        icon = '<i class="fa-solid fa-triangle-exclamation text-base"></i>';
    }
    
    toast.className += ' ' + bgClass;
    toast.innerHTML = `
        ${icon}
        <span class="text-xs font-bold tracking-wide">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger slide-up animation
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 50);
    
    // Hide after delay unless it is 'info' (which means saving)
    if (type !== 'info') {
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2500);
    }
}

// Function to save settings to the backend via Fetch API
function saveSettingsToServer() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const url = form.getAttribute('action');
    const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]').value;
    
    const themeToggle = document.getElementById('themeToggle');
    const notificationsToggle = document.querySelector('input[name="notifications"]');
    
    const data = {
        theme: (themeToggle && themeToggle.checked) ? 'dark' : 'light',
        notifications: (notificationsToggle && notificationsToggle.checked)
    };
    
    // Show premium "Saving..." spinner toast
    showToast('Saving changes...', 'info');
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(result => {
        if (result.status === 'success') {
            console.log("Settings successfully synced with backend!");
            showToast('Settings saved to cloud!', 'success');
        } else {
            showToast('Failed to save settings.', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
        showToast('Connection error. Saving locally instead.', 'warning');
    });
}

// Listen to submit event on form
const settingsForm = document.querySelector('form');
if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveSettingsToServer();
    });
}

// Theme toggle state synchronization
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.checked = document.documentElement.classList.contains('dark');
}

// Listen to dynamic change events on checkbox settings for auto-saving
document.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', function () {
        // Instant visual feedback for Theme change
        if (this.id === 'themeToggle') {
            if (this.checked) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                console.log("Dark mode activated");
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                console.log("Light mode activated");
            }
        }
        
        // Auto-save setting to Django backend instantly on toggle
        saveSettingsToServer();
    });
});
