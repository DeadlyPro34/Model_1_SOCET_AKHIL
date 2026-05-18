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

function saveCategory() {
    const name = document.getElementById('catName').value;
    if (!name) return;

    const grid = document.getElementById('categoryGrid');
    const card = document.createElement('div');
    card.className = "pro-card rounded-2xl p-6 group animate-pop";
    card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center text-xl">
                        <i class="fa-solid ${selectedIcon}"></i>
                    </div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="text-slate-400 hover:text-indigo-600 transition-colors"><i class="fa-solid fa-pen-to-square text-sm"></i></button>
                        <button class="text-slate-400 hover:text-red-500 transition-colors" onclick="this.closest('.pro-card').remove()"><i class="fa-solid fa-trash-can text-sm"></i></button>
                    </div>
                </div>
                <h3 class="font-bold text-slate-900 text-lg">${name}</h3>
                <p class="text-slate-500 text-sm mt-1">0 Saved Choices</p>
                <div class="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Just Added</span>
                    <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-100"></div>
                </div>
            `;

    grid.prepend(card);
    toggleModal(false);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleModal(false);
});
