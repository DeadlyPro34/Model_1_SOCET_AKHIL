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
            grid: { color: '#F1F5F9', drawBorder: false },
            ticks: { font: { family: 'Inter', size: 10 }, color: '#94A3B8' }
        },
        x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 10 }, color: '#94A3B8' }
        }
    }
};

window.onload = function () {
    // Category Bar Chart
    const ctxBar = document.getElementById('categoryBarChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Food', 'Study', 'Health', 'Social', 'Work', 'Finance'],
            datasets: [{
                label: 'Decisions',
                data: [48, 32, 24, 36, 18, 12],
                backgroundColor: '#6366f1',
                borderRadius: 8,
                barThickness: 24
            }]
        },
        options: chartOptions
    });

    // Decision Distribution Pie Chart
    const ctxPie = document.getElementById('decisionPieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Automated', 'Weighted', 'Quick Random', 'AI Assisted'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#4F46E5', '#818CF8', '#C7D2FE', '#E0E7FF'],
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
};
