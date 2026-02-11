import { createDataIntoDatasets } from './chartParams.js';
import { scales } from './chartParams.js';
import { updateMetrics } from './metrics.js';

let marketChart = null;

export function renderCharts(data) {
    window.lastChartData = data; // Armazena para o reset global

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
        plugins: [{
            id: 'handleMouseOut',
            afterEvent: (chart, args) => {
                const { event } = args;
                if (event.type === 'mouseout') {
                    updateMetrics(data[data.length - 1], true);
                }
            },
        },
        {
            id: 'verticalHoverLine',
            beforeDatasetsDraw(chart, args, plugins) {
                const { ctx, chartArea: { top, bottom, height } } = chart;

                ctx.save();

                chart.getDatasetMeta(0).data.forEach((dataPoint, index) => {
                    if (dataPoint.active === true) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'gray';
                        ctx.moveTo(dataPoint.x, top);
                        ctx.lineTo(dataPoint.x, bottom);
                        ctx.stroke();
                    }
                })
            }
        },
            // {
            //     id: 'stackSeparators',
            //     afterDraw: (chart) => {
            //         const { ctx, chartArea: { left, right }, scales } = chart;
            //         const stackScales = ['yFearGreed', 'yPrice', 'yMvrv'];

            //         ctx.save();
            //         ctx.strokeStyle = '#1f2933'; // Cor da linha separadora
            //         ctx.lineWidth = 1;

            //         stackScales.forEach((scaleId) => {
            //             const scale = scales[scaleId];
            //             if (scale) {
            //                 // Desenha uma linha no topo de cada área de gráfico
            //                 ctx.beginPath();
            //                 ctx.moveTo(left, scale.top);
            //                 ctx.lineTo(right, scale.top);
            //                 ctx.stroke();
            //             }
            //         });
            //         ctx.restore();
            //     }
            // }
        ],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,

            interaction: {
                mode: 'index',
                intersect: false,
                includeInvisible: false,
            },

            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        // Filtra e remove qualquer dataset que tenha label vazia
                        filter: (legendItem, chartData) => {
                            return legendItem.text !== '';
                        }
                    }
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
                            updateMetrics(data[index], true);
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

    marketChartElement.addEventListener('touchend', () => {
        marketChart.setActiveElements([]);
        marketChart.tooltip.setActiveElements([], { x: 0, y: 0 });

        marketChart.update();

        updateMetrics(data[data.length - 1], true);
    });
}

