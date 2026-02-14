import requests
import pandas as pd
from datetime import datetime, timezone
from coinmetrics.api_client import CoinMetricsClient
import json
import yfinance as yf


# ------------------- Yahoo para Múltiplo de Mayer -------------------

# 1. Baixamos o histórico diário para a média (SMA200)
data_hist = yf.download("BTC-USD", period="2y", interval="1d")

# 2. Baixamos o preço "agora" (últimos minutos)
data_now = yf.download("BTC-USD", period="1d", interval="1m")

# Tratando o MultiIndex do Yahoo
if isinstance(data_hist['Close'], pd.DataFrame):
    close_hist = data_hist['Close']['BTC-USD']
    latest_price = data_now['Close']['BTC-USD'].iloc[-1]
else:
    close_hist = data_hist['Close']
    latest_price = data_now['Close'].iloc[-1]

# 3. Calcular SMA200 (usando os dados diários)
sma200 = close_hist.rolling(window=200).mean().iloc[-1]

# 4. Calcular Mayer Multiple com o preço de AGORA
latest_mayer = latest_price / sma200

# ------------------- Fear & Greed Index (Alternative.me) -------------------
url_fng = "https://api.alternative.me/fng/?limit=1"
response_fng = requests.get(url_fng)
if response_fng.status_code != 200:
    print(f"Erro na API Fear & Greed Index: Status {response_fng.status_code}")
    print(response_fng.text)
    exit()

data_fng = response_fng.json()
fear_greed_value = data_fng['data'][0]['value']
fear_greed_classification = data_fng['data'][0]['value_classification']

# ------------------- MVRV (CoinMetrics) -------------------
client = CoinMetricsClient()

# Requesting MVRV only (most recent)
data = client.get_asset_metrics(
    assets='btc',
    metrics=['CapMVRVCur'],
    frequency='1d'
)

# Convert to list
price_list = data.to_list()

latest_mvrv = None
mvrv_date = None

if price_list:
    # Iterate backwards to find the most recent MVRV
    for entry in reversed(price_list):
        if entry.get('CapMVRVCur') is not None:
            latest_mvrv = float(entry['CapMVRVCur'])
            mvrv_date = entry['time']
            mvrv_date_formatted = pd.to_datetime(mvrv_date).strftime('%d/%m/%Y') # Se quiser usar
            break


# ------------------- Resultado -------------------
print(f"Último preço do BTC: ${latest_price:.0f}")
print(f"MVRV: {latest_mvrv:.2f}")
print(f"Múltiplo de Mayer: {latest_mayer:.2f}")
print(f"Fear & Greed Index: {fear_greed_value} - {fear_greed_classification}")

# Dados que queremos salvar
data_to_save = {
    "date": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
    "price": round(latest_price, 0),
    "mayer": round(latest_mayer, 2),
    "fear_greed": {
        "value": int(fear_greed_value),
        "classification": fear_greed_classification
    },
    "mvrv": round(latest_mvrv, 2),
}

print(f"data: ' + {data_to_save}")

# Salva no arquivo metrics.json
with open("metrics.jsonl", "a") as f:  # 'a' = append
    f.write(json.dumps(data_to_save))
    