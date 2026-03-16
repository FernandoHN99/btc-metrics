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

This project is organized as a single repository with two main branches:

### **Backend Branch** (`backend`)
```
backend/
├── backend/
│   ├── btc_metrics.py       # Main data collection script
│   ├── requirements.txt     # Python dependencies
├── metrics.jsonl           # Historical metrics database
```

### **Frontend Branch** (`frontend`)
```
frontend/
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
```

**Last Updated:** March 16, 2026  
**Version:** 1.0.0
