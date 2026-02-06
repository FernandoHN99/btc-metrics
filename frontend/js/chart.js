let marketChart = null;

export function renderChart(data) {
    if (!Array.isArray(data) || !data.length) return;

    data = [...data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const ctx = document.getElementById('marketChart');
    if (!ctx) return;

    const labels = data.map(d =>
        new Date(d.date).getTime()
    );

    // 🔒 destroy seguro
    if (marketChart instanceof Chart) {
        marketChart.destroy();
    }

    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'BTC Price',
                    data: data.map(d => d.price),
                    borderColor: '#f7931a',
                    borderWidth: 2,
                    tension: 0.35,
                    yAxisID: 'yPrice'
                },
                {
                    label: 'Mayer Multiple',
                    data: data.map(d => d.mayer),
                    borderColor: '#4ade80',
                    borderWidth: 1.8,
                    tension: 0.35,
                    yAxisID: 'yMayer'
                },
                {
                    label: 'MVRV',
                    data: data.map(d => d.mvrv),
                    borderColor: '#60a5fa',
                    borderWidth: 1.8,
                    tension: 0.35,
                    yAxisID: 'yMvrv'
                },
                {
                    label: 'Fear & Greed',
                    data: data.map(d => Number(d.fear_greed.value)),
                    borderColor: '#f87171',
                    borderWidth: 1.8,
                    tension: 0.35,
                    yAxisID: 'yFg'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: 'index',
                intersect: false
            },

            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    position: 'nearest',
                    animation: false,
                    caretSize: 6,
                    padding: 10,

                    callbacks: {
                        title(items) {
                            if (!items.length) return '';

                            const index = items[0].dataIndex;
                            const date = new Date(data[index].date);

                            if (window.currentRange === '1D') {
                                // 📅🕒 06/02/2026 14:35
                                return date.toLocaleString('pt-BR');
                            }

                            // 📅 06/02/2026
                            return date.toLocaleDateString('pt-BR');
                        }
                    }
                }
            },

            // ✅ SCALES NO LUGAR CORRETO
            scales: {
                x: {
                    display: false, // esconde labels
                },

                yPrice: {
                    type: 'linear',
                    position: 'left',
                    grid: {
                        drawBorder: true,
                        borderColor: '#9ca3af',
                        borderWidth: 1.5
                    },
                    title: {
                        display: true,
                        text: 'BTC Price',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#6b7280'
                    }
                },

                yMayer: {
                    type: 'linear',
                    position: 'left',
                    stack: 'indicators',
                    stackWeight: 1,
                    display: false
                },

                yMvrv: {
                    type: 'linear',
                    position: 'left',
                    stack: 'indicators',
                    stackWeight: 1,
                    display: false
                },

                yFg: {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: 100,
                    stack: 'indicators',
                    stackWeight: 1,
                    display: false
                }
            }
        }
    });
}
