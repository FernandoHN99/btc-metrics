import { scoreMVRV, scoreMayer, scoreFearGreed, calculateIndicator, baseColors} from "./indicator.js";

export function updateMetrics(latest, isHover) {
    if (!latest) return;

    const rawMvrv = latest?.mvrv ;
    const rawMayer = latest?.mayer;
    const rawFG = latest?.fear_greed?.value;
    const rawFGClass = latest?.fear_greed?.classification;

    const mvrv = rawMvrv ? scoreMVRV(rawMvrv) : null;
    const mayer = rawMayer ? scoreMayer(rawMayer) : null;
    const fearGreed = rawFG ? scoreFearGreed(rawFG) :  null;
    const indicator = calculateIndicator({ fearGreed: rawFG, mayer: rawMayer, mvrv: rawMvrv });

    // Price
    document.getElementById('metric-price').textContent = latest?.price ? `$${latest.price?.toLocaleString('en-US')}` : '-';

    // MVRV
    const elementMVRV = document.getElementById('metric-mvrv');
    elementMVRV.style.color = mvrv?.color || baseColors.color3;
    elementMVRV.innerHTML = rawMvrv !== null ? rawMvrv.toFixed(2) : '-';

    // Mayer
    const elementMayer = document.getElementById('metric-mayer');
    elementMayer.style.color = mayer?.color || baseColors.color3;
    elementMayer.innerHTML = rawMayer !== null ? rawMayer.toFixed(2) : '-';

    // Fear & Greed
    const elementFearGreed = document.getElementById('metric-fg');
    elementFearGreed.style.color = fearGreed?.color || baseColors.color3;
    elementFearGreed.innerHTML = rawFG !== null ? `${rawFG} - ${rawFGClass}` : '-';

    const elementIndicator = document.getElementById('metric-score');
    elementIndicator.style.color = indicator.color;
    
    const scoreText = indicator.valueNormalized !== '-' ? `${indicator.valueNormalized} / 10` : '-';
    elementIndicator.innerHTML = `${indicator.label} ${indicator.valueNormalized !== '-' ? '- ' + scoreText : ''}`;

    if (!isHover) {
        document.getElementById('last-update-datetime').textContent =
            `Última Atualização: ${new Date(latest.date).toLocaleString('pt-BR').slice(0, 17)}`;
    }
}
