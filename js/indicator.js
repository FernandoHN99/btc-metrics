export const baseColors = {
    color1: 'red',
    color2: '#22c55e',
    color3: '#22c55e',
    color4: '#22c55e',
    color5: 'green',
}

function mountReturn(indexControl, valueNormalized) {
    if (indexControl === 1) return { valueNormalized, color: baseColors.color1, label: 'Strong Sell' } 
    if (indexControl === 2) return { valueNormalized, color: baseColors.color2, label: 'Moderate Sell' } 
    if (indexControl === 3) return { valueNormalized, color: baseColors.color3, label: 'Hold' } 
    if (indexControl === 4) return { valueNormalized, color: baseColors.color4, label: 'Moderate Buy' } 
    if (indexControl === 5) return { valueNormalized, color: baseColors.color5, label: 'Strong Buy' } 
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
    let totalScore = 0;
    let totalWeight = 0;

    if (mvrv !== null && mvrv !== undefined) {
        totalScore += scoreMVRV(mvrv).valueNormalized * 0.5;
        totalWeight += 0.5;
    }
    if (mayer !== null && mayer !== undefined) {
        totalScore += scoreMayer(mayer).valueNormalized * 0.3;
        totalWeight += 0.3;
    }
    if (fearGreed !== null && fearGreed !== undefined) {
        totalScore += scoreFearGreed(fearGreed).valueNormalized * 0.2;
        totalWeight += 0.2;
    }

    if (totalWeight === 0) return { valueNormalized: '-', color: baseColors.color3, label: 'N/A' };

    const finalScore = parseFloat((totalScore / totalWeight).toFixed(1));

    if (finalScore <= 2.0) return mountReturn(1, finalScore);
    if (finalScore <= 4.0) return mountReturn(2, finalScore);
    if (finalScore <= 6.0) return mountReturn(3, finalScore);
    if (finalScore <= 8.0) return mountReturn(4, finalScore);
    return mountReturn(5, finalScore);
}