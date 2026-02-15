import { scoreMVRV, scoreMayer, scoreFearGreed, calculateIndicator} from "./indicator.js";
import { isValid } from "./utils.js";

export function updateMetrics(latest, isHover) {
    if (!latest) return;

    const rawMvrv = latest?.mvrv ;
    const rawMayer = latest?.mayer;
    const rawFG = latest?.fear_greed?.value;
    const rawFGClass = latest?.fear_greed?.classification;

    const mvrv = scoreMVRV(rawMvrv);
    const mayer = scoreMayer(rawMayer);
    const fearGreed = scoreFearGreed(rawFG);
    const indicator = calculateIndicator({ fearGreed: rawFG, mayer: rawMayer, mvrv: rawMvrv });

    // Price
    document.getElementById('metric-price').textContent = latest?.price ? `$${latest.price?.toLocaleString('en-US')}` : '-';

    // MVRV
    const elementMVRV = document.getElementById('metric-mvrv');
    elementMVRV.style.color = mvrv.color;
    elementMVRV.innerHTML = isValid(rawMvrv) ? rawMvrv.toFixed(2) : '-';

    // Mayer
    const elementMayer = document.getElementById('metric-mayer');
    elementMayer.style.color = mayer.color;
    elementMayer.innerHTML = isValid(rawMayer) !== null ? rawMayer.toFixed(2) : '-';

    // Fear & Greed
    const elementFearGreed = document.getElementById('metric-fg');
    elementFearGreed.style.color = fearGreed.color;
    elementFearGreed.innerHTML = isValid(rawFG) ? `${rawFG} - ${rawFGClass}` : '-';

    const elementIndicator = document.getElementById('metric-score');
    elementIndicator.style.color = indicator.color;

    const scoreText = indicator.valueNormalized !== '-' ? `${indicator.valueNormalized} / 10` : '-';
    elementIndicator.innerHTML = `${indicator.label} ${indicator.valueNormalized !== '-' ? '- ' + scoreText : ''}`;

    if (!isHover) {
        document.getElementById('last-update-datetime').textContent =
            `Última Atualização: ${new Date(latest.date).toLocaleString('pt-BR').slice(0, 17)}`;
    }
}
