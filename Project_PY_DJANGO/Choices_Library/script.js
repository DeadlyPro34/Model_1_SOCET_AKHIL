function toggleModal(show) {
    const modal = document.getElementById('addChoiceModal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
        document.getElementById('choiceName').value = '';
    }
}

function saveChoice() {
    const name = document.getElementById('choiceName').value;
    const category = document.getElementById('choiceCategory').value;

    if (!name) return;

    const tableBody = document.getElementById('choiceTableBody');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Map category to a color/icon (simple mockup logic)
    let iconClass = "fa-star";
    let colorClass = "bg-indigo-50 text-indigo-600";
    let pillClass = "bg-indigo-100 text-indigo-700";

    if (category === "Food & Dining") {
        iconClass = "fa-pizza-slice";
        colorClass = "bg-orange-50 text-orange-600";
        pillClass = "bg-orange-100 text-orange-700";
    } else if (category === "Health") {
        iconClass = "fa-dumbbell";
        colorClass = "bg-blue-50 text-blue-600";
        pillClass = "bg-blue-100 text-blue-700";
    }

    const newRow = document.createElement('tr');
    newRow.className = "hover:bg-slate-50/50 transition-colors group";
    newRow.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded ${colorClass} flex items-center justify-center">
                            <i class="fa-solid ${iconClass} text-[10px]"></i>
                        </div>
                        <span class="font-medium text-slate-700">${name}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="status-pill ${pillClass}">${category}</span>
                </td>
                <td class="px-6 py-4 text-slate-500 italic">${today}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button class="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="p-2 text-slate-400 hover:text-red-500 transition-colors" onclick="this.closest('tr').remove()"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;

    tableBody.prepend(newRow);
    toggleModal(false);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleModal(false);
});