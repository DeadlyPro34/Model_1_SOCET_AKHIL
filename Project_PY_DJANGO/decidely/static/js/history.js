document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('historySearchInput');
    const dateInput = document.getElementById('historyDateInput');
    const categoryFilter = document.getElementById('historyCategoryFilter');
    const resetBtn = document.getElementById('historyResetBtn');
    const rows = document.querySelectorAll('.history-row');

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedDate = dateInput ? dateInput.value : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';

        rows.forEach(row => {
            const pool = row.getAttribute('data-pool') || '';
            const result = row.getAttribute('data-result') || '';
            const categoryId = row.getAttribute('data-category-id') || '';
            const date = row.getAttribute('data-date') || ''; // Format is Y-m-d

            const matchesSearch = !query || pool.includes(query) || result.includes(query);
            const matchesCategory = !selectedCategory || categoryId === selectedCategory;
            const matchesDate = !selectedDate || date === selectedDate;

            if (matchesSearch && matchesCategory && matchesDate) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (dateInput) dateInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        applyFilters();
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (dateInput) dateInput.addEventListener('change', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
});
