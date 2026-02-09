const username = 'FernandoHN99';
const repo = 'btc-metrics';
const branch = 'main';
const file = 'metrics.jsonl';
const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${file}`;

export async function fetchMetrics() {
  try {
    const response = await fetch(url, { cache: 'no-store' })
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