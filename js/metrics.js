import { scoreMVRV, scoreMayer, scoreFearGreed, calculateIndicator} from "./indicator.js";

export function updateMetrics(latest, isHover) {
    if (!latest) return;

    const mvrv = scoreMVRV(latest.mvrv);
    const mayer = scoreMayer(latest.mayer);
    const fearGreed = scoreFearGreed(latest.fear_greed.value);
    const indicator = calculateIndicator(
        {fearGreed: latest.fear_greed.value, mayer: latest.mayer , mvrv: latest.mvrv}
    );

    document.getElementById('metric-price').textContent =
        `$${latest.price.toLocaleString('en-US')}`;

    const elementMVRV = document.getElementById('metric-mvrv')
    elementMVRV.style.color = `${mvrv.color}`;
    elementMVRV.innerHTML = `${latest.mvrv.toFixed(2)}`;

    const elementMayer = document.getElementById('metric-mayer')
    elementMayer.style.color = `${mayer.color}`;
    elementMayer.innerHTML = `${latest.mayer.toFixed(2)}`;

    const elementFearGreed = document.getElementById('metric-fg')
    elementFearGreed.style.color = `${fearGreed.color}`;
    elementFearGreed.innerHTML = `${latest.fear_greed.value} - ${latest.fear_greed.classification}`;

    const elementIndicator = document.getElementById('metric-score')
    elementIndicator.style.color = `${indicator.color}`;
    elementIndicator.innerHTML = `${indicator.label} - ${indicator.valueNormalized} / 10`;

    if(!isHover){
        document.getElementById('last-update-datetime').textContent =
        `Última Atualização: ${new Date(latest.date).toLocaleString('pt-BR').slice(0,17)}`;
    }
}
