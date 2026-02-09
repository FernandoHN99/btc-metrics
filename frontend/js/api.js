export async function fetchMetrics() {
  try {
    const url = new URL('/metrics.jsonl', import.meta.url);

    const response = await fetch(url, { cache: 'no-store' });
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
