document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const saveStatus = document.getElementById('saveStatus');

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('profilePassword').value;
            const confirmPassword = document.getElementById('profileConfirmPassword').value;

            if (password && password !== confirmPassword) {
                alert('Passwords do not match! Please verify your password entry.');
                return;
            }

            const formData = new FormData(profileForm);
            
            try {
                const response = await fetch('/profile/', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        // Dynamically update UI
                        const displayName = document.getElementById('profileDisplayName');
                        const displayEmail = document.getElementById('profileDisplayEmail');
                        
                        if (displayName) {
                            displayName.textContent = `${data.first_name} ${data.last_name}`;
                        }
                        if (displayEmail) {
                            displayEmail.textContent = data.email;
                        }

                        // Show beautiful status message
                        saveStatus.classList.remove('hidden');
                        setTimeout(() => {
                            saveStatus.classList.add('hidden');
                        }, 3000);
                        
                        // Clear password inputs
                        document.getElementById('profilePassword').value = '';
                        document.getElementById('profileConfirmPassword').value = '';
                    } else {
                        alert(data.message || 'Error saving profile.');
                    }
                } else {
                    alert('An error occurred while saving profile.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Network connection error. Please try again.');
            }
        });
    }
});
