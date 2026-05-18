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

// Theme toggle specific logic (Mock)
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', function () {
    if (this.checked) {
        console.log("Dark mode visual state activated (Mock)");
    } else {
        console.log("Light mode visual state activated (Mock)");
    }
});