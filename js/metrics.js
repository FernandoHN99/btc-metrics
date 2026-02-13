import { calculateIndicator, getIndicatorLabel } from "./indicator.js";

export function updateMetrics(latest, isHover) {
    if (!latest) return;

    const indicatorValue = calculateIndicator({fearGreed: latest.fear_greed.value, mayer: latest.mayer, mvrv: latest.mvrv});
    const indicatorLabel = getIndicatorLabel(indicatorValue);

    document.getElementById('metric-price').textContent =
        `$${latest.price.toLocaleString('en-US')}`;

    document.getElementById('metric-mvrv').textContent =
        latest.mvrv.toFixed(2);

    document.getElementById('metric-mayer').textContent =
        latest.mayer.toFixed(2);

    document.getElementById('metric-fg').textContent =
        `${latest.fear_greed.value} - ${latest.fear_greed.classification}`;

    const element = document.getElementById('metric-score')
    element.style.color = `${indicatorLabel.color}`;
    element.innerHTML = `  ${indicatorLabel.label} - ${indicatorValue} / 10`;

    if(!isHover){
        document.getElementById('last-update-datetime').textContent =
        `Última Atualização: ${new Date(latest.date).toLocaleString('pt-BR').slice(0,17)}`;
    }
}
