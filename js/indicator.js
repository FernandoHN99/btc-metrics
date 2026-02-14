function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function scoreFearGreed(fg) {
    // fg vai de 0 a 100
    // inverte a lógica: medo = compra
    const score = 10 - (fg / 10);

    return clamp(score, 0, 10);
}

function scoreMayer(mayer) {
    let score;

    if (mayer < 0.8) {
        score = 10; // fundo histórico
    } else if (mayer < 1.0) {
        score = 8;
    } else if (mayer < 1.5) {
        score = 6;
    } else if (mayer < 2.0) {
        score = 4;
    } else if (mayer < 2.6) {
        score = 2;
    } else {
        score = 0; // sobrecompra extrema
    }

    return score;
}

function scoreMVRV(mvrv) {
    if (mvrv < 0.8) return 10;
    if (mvrv < 1.0) return 9;  
    if (mvrv < 1.5) return 7;   
    if (mvrv < 2.0) return 5;
    if (mvrv < 2.6) return 3;    
    if (mvrv < 3.0) return 1;   
    return 0;                   
}

export function calculateIndicator({ fearGreed, mayer, mvrv }) {
    const fgScore = scoreFearGreed(fearGreed);
    const mayerScore = scoreMayer(mayer);
    const mvrvScore = scoreMVRV(mvrv);

    const finalScore =
        (mvrvScore * 0.5) +
        (mayerScore * 0.3) +
        (fgScore * 0.2);

    return Number(finalScore.toFixed(1));
}

export function getIndicatorLabel(score) {
  if (score <= 2.0) {
    return {
      label: "Strong Sell",
      description: "Indicator suggests high correction risk. Reduce exposure.",
      color: "darkred",
      sentiment: "Extreme Euphoria"
    };
  }

  if (score <= 4.0) {
    return {
      label: "Moderate Sell",
      description: "Indicator suggests moderate correction risk. Evaluate reducing exposure.",
      color: "red",
      sentiment: "High Optimism"
    };
  }

  if (score <= 6.0) {
    return {
      label: "Hold",
      description: "Healthy indicators. Maintain position or rebalance.",
      color: "orange",
      sentiment: "Balanced"
    };
  }

  if (score <= 8.0 ) {
    return {
      label: "Moderate Buy",
      description: "Indicator suggests moderate upside. Evaluate increasing exposure.",
      color: "yellow",
      sentiment: "Caution with Opportunity bias"
    };
  }

  return {
    label: "Strong Buy",
    description: "Indicator suggests strong upside potential. Accumulate/Increase exposure.",
    color: "green",
    sentiment: "Fear / Capitulation"
  };
}
