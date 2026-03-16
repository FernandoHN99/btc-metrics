# 📊 Bitcoin Metrics Dashboard

A real-time Bitcoin analysis dashboard that tracks key metrics to help investors identify market opportunities and risks. The application combines on-chain metrics with sentiment analysis to provide a comprehensive view of Bitcoin's market health.

🌐 **[View Live Dashboard →](https://fernandohn99.github.io/btc-metrics/)**

## 🎯 Features

- **Real-time Bitcoin Price** - Current BTC/USD price from Yahoo Finance
- **MVRV Ratio (Market Value to Realized Value)** - On-chain metric showing market valuation relative to realized value
- **Mayer Multiple** - Ratio of current price to 200-day moving average
- **Fear & Greed Index** - Sentiment indicator derived from multiple data sources
- **Composite Indicator Score** - Weighted scoring system combining all metrics (0-10 scale)
- **Interactive Charts** - Visualize metrics over customizable time ranges (1D to 5Y)
- **Historical Data** - Append-only JSONL storage for persistent metric tracking

## 📁 Project Structure

```
010-BitcoinMetrcis/
├── backend/
│   ├── btc_metrics.py       # Main data collection script
│   └── requirements.txt     # Python dependencies
├── js/
│   ├── main.js             # Application entry point
│   ├── api.js              # Fetch metrics from GitHub
│   ├── metrics.js          # Display metrics on dashboard
│   ├── indicator.js        # Scoring algorithms
│   ├── chart.js            # Chart rendering with Chart.js
│   ├── chartParams.js      # Chart configuration
│   ├── timeFilters.js      # Time range filtering & aggregation
│   └── utils.js            # Helper functions
├── index.html              # Main HTML page
├── styles.css              # Dashboard styling
├── metrics.jsonl           # Historical metrics database
└── readme.md               # This file
```


**Last Updated:** March 16, 2026  
**Version:** 1.0.0
