import requests
import pandas as pd
from datetime import datetime, timezone
from coinmetrics.api_client import CoinMetricsClient
import json

# ------------------- CoinGecko para Múltiplo de Mayer -------------------
API_KEY_GECKO = "CG-ayNYBkPDUfbHRwk4MbWVrYiE"
url_prices = f"https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&x_cg_demo_api_key={API_KEY_GECKO}"

response_prices = requests.get(url_prices)
if response_prices.status_code != 200:
    print(f"Erro na API CoinGecko: Status {response_prices.status_code}")
    print(response_prices.text)
    exit()

data_prices = response_prices.json()
if 'prices' not in data_prices:
    print("Erro: 'prices' não encontrado no JSON retornado pela API.")
    print(data_prices)
    exit()

# Criar DataFrame e calcular SMA200
prices = data_prices['prices']
df = pd.DataFrame(prices, columns=['timestamp', 'price'])
df['date'] = pd.to_datetime(df['timestamp'], unit='ms')
df.set_index('date', inplace=True)
df.drop('timestamp', axis=1, inplace=True)
df['SMA200'] = df['price'].rolling(window=200).mean()
df['mayer_multiple'] = df['price'] / df['SMA200']
latest_mayer = df['mayer_multiple'].iloc[-1]
latest_price = df['price'].iloc[-1]

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
    "date": datetime.now(timezone.utc).isoformat(),
    "price": round(latest_price, 0),
    "mayer": round(latest_mayer, 2),
    "fear_greed": {
        "value": fear_greed_value,
        "classification": fear_greed_classification
    },
    "mvrv": latest_mvrv,
}

# Salva no arquivo metrics.json
with open("metrics.jsonl", "a") as f:  # 'a' = append
    f.write(json.dumps(data_to_save) + "\n")
    