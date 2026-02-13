import yfinance as yf
import pandas as pd
from datetime import datetime, timezone
import requests
import json
from coinmetrics.api_client import CoinMetricsClient

# Configurações
DIAS_HISTORICO = 2000

# ------------------- 1. Yahoo Finance (Preço e Mayer) -------------------
# Baixamos 2 anos para garantir o cálculo da SMA200
data_yf = yf.download("BTC-USD", period="2y", interval="1d")

# Tratando MultiIndex (comum nas versões novas do yfinance)
if isinstance(data_yf['Close'], pd.DataFrame):
    close_hist = data_yf['Close']['BTC-USD']
else:
    close_hist = data_yf['Close']

# 3. Calcular SMA200 (usando os dados diários)
sma200 = close_hist.rolling(window=200).mean().iloc[-1]

df = pd.DataFrame(close_hist)
df.columns = ['price']
df.index = pd.to_datetime(df.index).normalize()

# Cálculos Técnicos
df['SMA200'] = df['price'].rolling(window=200).mean()
df['mayer_multiple'] = df['price'] / df['SMA200']

# ------------------- 2. Fear & Greed Index (Histórico) -------------------
url_fng = f"https://api.alternative.me/fng/?limit={DIAS_HISTORICO}"
response_fng = requests.get(url_fng)
data_fng = response_fng.json()

fng_history = {}
for entry in data_fng['data']:
    dt = pd.to_datetime(int(entry['timestamp']), unit='s').normalize()
    fng_history[dt] = {
        "value": entry['value'],
        "classification": entry['value_classification']
    }

# ------------------- 3. MVRV (CoinMetrics) -------------------
client = CoinMetricsClient()
data_mvrv = client.get_asset_metrics(
    assets='btc',
    metrics=['CapMVRVCur'],
    frequency='1d',
    start_time=(pd.Timestamp.now() - pd.Timedelta(days=DIAS_HISTORICO + 5)).strftime('%Y-%m-%d')
).to_dataframe()

data_mvrv['time'] = pd.to_datetime(data_mvrv['time']).dt.tz_localize(None).dt.normalize()
data_mvrv.set_index('time', inplace=True)

# ------------------- 4. Consolidando os últimos 100 dias -------------------
df_last_100 = df.tail(DIAS_HISTORICO).copy()

with open("./history.jsonl", "w") as f:
    for date, row in df_last_100.iterrows():
        fng_data = fng_history.get(date, {"value": None, "classification": "N/A"})
        
        try:
            mvrv_val = data_mvrv.loc[date, 'CapMVRVCur']
            if isinstance(mvrv_val, pd.Series):
                mvrv_val = mvrv_val.iloc[0]
        except KeyError:
            mvrv_val = None

        record = {
            "date": date.isoformat(),
            "price": round(float(row['price']), 0),
            "mayer": round(float(row['mayer_multiple']), 2) if pd.notnull(row['mayer_multiple']) else None,
            "fear_greed": fng_data,
            "mvrv": round(float(mvrv_val), 2) if mvrv_val is not None else None
        }
        
        f.write(json.dumps(record) + "\n")

print(f"Sucesso! Arquivo history.jsonl gerado.")