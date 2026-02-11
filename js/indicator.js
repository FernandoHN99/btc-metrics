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
    let score;

    if (mvrv < 0.8) {
        score = 10;
    } else if (mvrv < 1.0) {
        score = 9;
    } else if (mvrv < 1.5) {
        score = 7;
    } else if (mvrv < 2.0) {
        score = 5;
    } else if (mvrv < 3.0) {
        score = 3;
    } else if (mvrv < 4.0) {
        score = 1;
    } else {
        score = 0;
    }

    return score;
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
      label: "Venda Forte",
      description:
        "Indicador sugere risco elevado de correção. Reduza exposição",
      color: "darkred",
      sentiment: "Euforia extrema"
    };
  }

  if (score <= 4.0) {
    return {
      label: "Venda Moderada",
      description:
        "Indicador sugere risco moderado de correção. Avalie reduzir exposição.",
      color: "red",
      sentiment: "Otimismo elevado"
    };
  }

  if (score <= 6.0) {
    return {
      label: "Neutro / Manutenção",
      description:
        "Indicador saudável. Manter posição ou rebalancear.",
      color: "orange",
      sentiment: "Equilíbrio"
    };
  }

  if (score <= 8.0) {
    return {
      label: "Compra Moderada",
      description:
        "Indicador sugere moderada valorização. Avalie aumentar exposição.",
      color: "yellow",
      sentiment: "Cautela com viés de oportunidade"
    };
  }

  return {
    label: "Compra Forte",
    description:
      "Indicador sugere forte valorização. Aumente exposição.",
    color: "green", //24af24ff
    sentiment: "Medo / Capitulação"
  };
}
