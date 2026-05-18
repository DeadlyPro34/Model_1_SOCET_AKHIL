document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('choiceSearchInput');
    const categoryFilter = document.getElementById('choiceCategoryFilter');
    const rows = document.querySelectorAll('.choice-row');

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';

        rows.forEach(row => {
            const name = row.getAttribute('data-choice-name') || '';
            const categoryId = row.getAttribute('data-category-id') || '';

            const matchesSearch = !query || name.includes(query);
            const matchesCategory = !selectedCategory || categoryId === selectedCategory;

            if (matchesSearch && matchesCategory) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
});
