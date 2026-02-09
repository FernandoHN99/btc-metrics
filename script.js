document.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('marketChart').getContext('2d');
  const actionIndicator = document.getElementById('actionIndicator');
  const recommendationText = document.getElementById('recommendationText');

  async function fetchMetrics() {
    try {
      const response = await fetch('metrics.jsonl');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const lines = text.trim().split('\n');
      return lines.map(line => JSON.parse(line));
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return [];
    }
  }

  function updateRecommendation(latest) {
    const score = calculateActionScore(latest);
    const percentage = (score / 10) * 100;
    actionIndicator.style.width = `${percentage}%`;

    if (score <= 3) {
      actionIndicator.className = 'indicator-fill red';
      recommendationText.textContent = 'Recomendação: Forte Venda';
    } else if (score <= 7) {
      actionIndicator.className = 'indicator-fill yellow';
      recommendationText.textContent = 'Recomendação: Manter';
    } else {
      actionIndicator.className = 'indicator-fill green';
      recommendationText.textContent = 'Recomendação: Forte Compra';
    }
  }

  function calculateActionScore(latest) {
    // Example calculation: Adjust this logic based on your parameters
    const { price, mvrv, mayer, fearGreed } = latest;
    let score = 0;

    if (mvrv < 1) score += 3; // Favorable MVRV
    if (mayer > 1) score += 3; // Favorable Mayer Multiple
    if (fearGreed > 50) score += 4; // High market confidence

    return Math.min(score, 10); // Cap the score at 10
  }

  function renderChart(data) {
    if (data.length === 0) {
      console.warn('No data available for chart.');
      return;
    }

    const labels = data.map(item => new Date(item.timestamp).toLocaleString());
    const values = data.map(item => item.value);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'BTC Metrics Over Time',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    });
  }

  const data = await fetchMetrics();
  if (data.length > 0) {
    updateRecommendation(data[data.length - 1]);
    renderChart(data);
  }
});