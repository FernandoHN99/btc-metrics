function mountReturn(indexControl, valueNormalized) {
    if (indexControl === 1) return { valueNormalized, color: 'red', label: 'Strong Sell' } 
    if (indexControl === 2) return { valueNormalized, color: '#94a3b8', label: 'Moderate Sell' } 
    if (indexControl === 3) return { valueNormalized, color: '#94a3b8', label: 'Hold' } 
    if (indexControl === 4) return { valueNormalized, color: '#94a3b8', label: 'Moderate Buy' } 
    if (indexControl === 5) return { valueNormalized, color: '#5ad587', label: 'Strong Buy' } 
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function scoreFearGreed(fg) {
    const score = 10 - (fg / 10);
    const finalScore = clamp(score, 0, 10);
    
    if (fg <= 25) return mountReturn(5, finalScore);
    if (fg <= 75) return mountReturn(3, finalScore);
    return mountReturn(1, finalScore);
}

export function scoreMayer(mayer) {
    if (mayer < 0.8) return mountReturn(5, 10);
    if (mayer < 1.0) return mountReturn(5, 8);
    if (mayer < 1.5) return mountReturn(4, 6);
    if (mayer < 2.0) return mountReturn(3, 4);
    if (mayer < 2.6) return mountReturn(2, 2);
    return mountReturn(1, 0);
}

export function scoreMVRV(mvrv) {
    if (mvrv < 0.8) return mountReturn(5, 10);
    if (mvrv < 1.0) return mountReturn(5, 9);
    if (mvrv < 1.5) return mountReturn(4, 7);
    if (mvrv < 2.0) return mountReturn(3, 5);
    if (mvrv < 2.6) return mountReturn(2, 3);
    return mountReturn(1, 0);
}

export function calculateIndicator({ fearGreed, mayer, mvrv }) {
    const fgScore = scoreFearGreed(fearGreed).valueNormalized;
    const mayerScore = scoreMayer(mayer).valueNormalized;
    const mvrvScore = scoreMVRV(mvrv).valueNormalized;

    const finalScore = parseFloat(((mvrvScore * 0.5) + (mayerScore * 0.3) + (fgScore * 0.2)).toFixed(1));

    if (finalScore <= 2.0) return mountReturn(1, finalScore);
    if (finalScore <= 4.0) return mountReturn(2, finalScore);
    if (finalScore <= 6.0) return mountReturn(3, finalScore);
    if (finalScore <= 8.0) return mountReturn(4, finalScore);
    return mountReturn(5, finalScore);
}
