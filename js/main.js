import { fetchMetrics } from './api.js';
import { updateMetrics } from './metrics.js';
import { renderCharts } from './chart.js';
import { filterByRange } from './timeFilters.js';

document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.time-filters button');

    const data = await fetchMetrics();
    if (!Array.isArray(data) || !data.length) return;

    updateMetrics(data[data.length - 1], false);

    function update(range) {
        window.currentRange = range;
        const filtered = filterByRange(data, range);
        renderCharts(filtered);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            update(btn.dataset.range);
        });
    });

    buttons[1].click();
});
