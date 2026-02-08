import { createDataIntoDatasets } from './chartParams.js';
import { scales } from './chartParams.js';

let marketChart = null;

export function renderCharts(data) {

    const datasets = createDataIntoDatasets(data)
    const labels = data.map(d =>
        new Date(d.date).getTime()
    );

    const marketChartElement = document.getElementById('marketChart');
    if (!marketChartElement) return;

    // 🔒 destroy seguro
    if (marketChart instanceof Chart) {
        marketChart.destroy();
    }

    marketChart = new Chart(marketChartElement, {
        type: 'line',
        data: {
            labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,

            interaction: {
                mode: 'nearest',
                intersect: false,
                includeInvisible: false
            },

            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    position: 'nearest',
                    xAlign: 'left',
                    yAlign: 'bottom',
                    caretSize: 6,
                    padding: 10,

                    callbacks: {
                        title(items) {
                            if (!items.length) return '';
                            const index = items[0].dataIndex;
                            const date = new Date(data[index].date);
                            if (window.currentRange === '1D') {
                                return date.toLocaleString('pt-BR');
                            }
                            return date.toLocaleDateString('pt-BR');
                        }
                    }
                }
            },

            scales: scales
        }
    })
}