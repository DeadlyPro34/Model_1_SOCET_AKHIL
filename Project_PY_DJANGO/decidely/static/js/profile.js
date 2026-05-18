function showUpdateMessage() {
    const status = document.getElementById('saveStatus');
    status.classList.remove('hidden');

    setTimeout(() => {
        status.classList.add('hidden');
    }, 3000);
}
