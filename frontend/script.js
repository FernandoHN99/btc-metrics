document.addEventListener('DOMContentLoaded', async () => {
  const elPrice = document.getElementById('metric-price');
  const elMvrv = document.getElementById('metric-mvrv');
  const elMayer = document.getElementById('metric-mayer');
  const elFG = document.getElementById('metric-fg');
  const elTime = document.getElementById('metric-time');

  const ctx = document.getElementById('metricsChart').getContext('2d');
  let chartInstance = null;

  async function fetchMetrics() {
    try {
      const response = await fetch('../metrics.jsonl', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      return text
        .trim()
        .split('\n')
        .map(line => JSON.parse(line));
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
      return [];
    }
  }

  function updateMetrics(latest) {
    if (!latest) return;

    elPrice.textContent = `$${latest.price.toLocaleString('en-US')}`;
    elMvrv.textContent = latest.mvrv.toFixed(2);
    elMayer.textContent = latest.mayer.toFixed(2);

    elFG.textContent = `${latest.fear_greed.value} – ${latest.fear_greed.classification}`;

    elTime.textContent = new Date(latest.date).toLocaleString();
  }

  function renderChart(data) {
    if (!data.length) return;

    const labels = data.map(d =>
      new Date(d.date).toLocaleString()
    );
    const prices = data.map(d => d.price);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'BTC Price (USD)',
            data: prices,
            borderWidth: 2,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tempo'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Preço (USD)'
            }
          }
        }
      }
    });
  }

  const data = await fetchMetrics();
  if (data.length) {
    updateMetrics(data[data.length - 1]);
    renderChart(data);
  }
});
