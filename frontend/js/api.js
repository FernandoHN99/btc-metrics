export async function fetchMetrics() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/FernandoHN99/btc-metrics/main/metrics.jsonl', { cache: 'no-store' })
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