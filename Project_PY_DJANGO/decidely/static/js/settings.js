function handleReset() {
    const confirmed = confirm("Warning: This will permanently delete all your data. Are you absolutely sure?");
    if (confirmed) {
        console.log("Data reset initiated...");
        // In a real app, this would trigger an API call.
    }
}

// Visual feedback for toggles
document.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', function () {
        const settingName = this.closest('.flex').querySelector('p.text-sm').innerText;
        console.log(`${settingName} set to: ${this.checked}`);
    });
});

// Theme toggle logic (Synchronize with localStorage and HTML class)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    // Set checkbox checked state based on active theme
    themeToggle.checked = document.documentElement.classList.contains('dark');
    
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            console.log("Dark mode activated");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            console.log("Light mode activated");
        }
    });
}
