// Setup shared options for minimal charts
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(148, 163, 184, 0.05)', drawBorder: false },
            ticks: { font: { family: 'Inter', size: 10 }, color: '#94A3B8' }
        },
        x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 10 }, color: '#94A3B8' }
        }
    }
};

window.onload = function () {
    const categoryLabels = JSON.parse(document.getElementById('category-labels-data').textContent || '[]');
    const categoryValues = JSON.parse(document.getElementById('category-values-data').textContent || '[]');

    // Category Bar Chart
    const ctxBar = document.getElementById('categoryBarChart');
    if (ctxBar) {
        new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: categoryLabels.length > 0 ? categoryLabels : ['No Data'],
                datasets: [{
                    label: 'Decisions',
                    data: categoryValues.length > 0 ? categoryValues : [0],
                    backgroundColor: '#6366f1',
                    borderRadius: 8,
                    barThickness: 24
                }]
            },
            options: chartOptions
        });
    }

    // Decision Distribution Pie Chart
    const ctxPie = document.getElementById('decisionPieChart');
    if (ctxPie) {
        new Chart(ctxPie.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: categoryLabels.length > 0 ? categoryLabels : ['No Data'],
                datasets: [{
                    data: categoryValues.length > 0 ? categoryValues : [0],
                    backgroundColor: ['#4F46E5', '#818CF8', '#C7D2FE', '#E0E7FF', '#312E81', '#1E1B4B'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                ...chartOptions,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { family: 'Inter', size: 11 }
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
};
