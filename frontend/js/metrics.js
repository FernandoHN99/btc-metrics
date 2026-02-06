export function updateMetrics(latest) {
  if (!latest) return;

  document.getElementById('metric-price').textContent =
    `$${latest.price.toLocaleString('en-US')}`;

  document.getElementById('metric-mvrv').textContent =
    latest.mvrv.toFixed(2);

  document.getElementById('metric-mayer').textContent =
    latest.mayer.toFixed(2);

  document.getElementById('metric-fg').textContent =
    `${latest.fear_greed.value} – ${latest.fear_greed.classification}`;
}
