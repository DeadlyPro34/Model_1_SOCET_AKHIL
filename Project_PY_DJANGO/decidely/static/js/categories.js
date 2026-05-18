let selectedIcon = 'fa-briefcase';

function toggleModal(show) {
    const modal = document.getElementById('addCategoryModal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
        document.getElementById('catName').value = '';
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('border-indigo-600', 'bg-indigo-50', 'text-indigo-600'));
    }
}

function selectIcon(el, icon) {
    document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('border-indigo-600', 'bg-indigo-50', 'text-indigo-600'));
    el.classList.add('border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
    selectedIcon = icon;
}

// Helper to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function saveCategory() {
    const nameInput = document.getElementById('catName');
    const name = nameInput.value.trim();
    if (!name) return;

    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    const csrfToken = csrfInput ? csrfInput.value : getCookie('csrftoken');

    fetch('/categories/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Instantly reload to render the gorgeous, complete, fully-wired card from the database!
            window.location.reload();
        } else {
            alert(data.message || 'Error creating category');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the category.');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleModal(false);
});
