# 🧠 AI Mutual Fund Investment Engine PRO

> Enterprise-grade mutual fund investment intelligence dashboard with AI-powered scoring and buy signals.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue)

---

## ✨ Features

### 📊 Dashboard
- **Portfolio Value** tracking with profit/loss
- **Buy Meter** (0-100) - Market opportunity gauge
- **Risk Meter** (0-100) - Portfolio risk assessment
- **Top 3 Weekly Recommendations** - AI-picked funds

### 🤖 AI Engine
- **AI Score (0-100)** for each fund
- **5 Signal Types**: Strong Buy, Buy, Accumulate, Hold, Avoid
- **Momentum Analysis**
- **Consistency Scoring**

### 📈 Analytics
- **Returns**: Daily, Weekly, Monthly, Yearly, CAGR
- **Rolling Returns**: 1M, 3M, 6M, 1Y, 3Y, 5Y
- **Risk Metrics**: Volatility, Sharpe, Sortino, Beta, Alpha
- **Drawdown Analysis**: Current, Maximum, Recovery

### 📱 Views
- Dashboard (Overview)
- Funds (Performance Matrix)
- AI Signals (Buy Recommendations)
- Portfolio (Holdings)
- Risk (Analysis)
- Charts (Visualizations)
- Reports (Weekly/Monthly)
- Logs (System)

---

## 🎯 Fixed 15 Funds

| # | Fund | Category | AMFI Code |
|---|------|----------|-----------|
| 1 | Quant Flexi Cap | Flexi Cap | 120828 |
| 2 | Quant Large & Mid Cap | Large & Mid | 120833 |
| 3 | Quant Multi Cap | Multi Cap | 150480 |
| 4 | Quant Multi Asset | Multi Asset | 120847 |
| 5 | Quant Infrastructure | Sectoral | 120465 |
| 6 | Quant BFSI | Sectoral | 147949 |
| 7 | Tata Digital India | Sectoral | 135804 |
| 8 | SBI Nifty 50 Index | Index | 119597 |
| 9 | UTI Nifty Next 50 Index | Index | 130427 |
| 10 | HDFC Mid Cap | Mid Cap | 100534 |
| 11 | SBI Small Cap | Small Cap | 125497 |
| 12 | Bandhan Small Cap | Small Cap | 145455 |
| 13 | ICICI Value Discovery | Value | 100666 |
| 14 | Axis ELSS Tax Saver | ELSS | 120503 |
| 15 | UTI Gold ETF FoF | Gold | 119850 |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

### 4. Click "Update Everything"
The engine will:
1. Fetch live NAV from AMFI
2. Download historical data
3. Calculate returns
4. Analyze risk
5. Generate AI scores
6. Create buy signals

---

## 🌐 Deployment

### Deploy to Vercel (FREE)

1. Push to GitHub
2. Connect to Vercel
3. Deploy!

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

---

## 🗄️ Supabase Setup (Optional)

For data persistence:

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in SQL Editor
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx       # Main header with market data
│   ├── LoadingScreen.tsx # Animated loading
│   ├── MetricCard.tsx   # Dashboard metrics
│   ├── FundTable.tsx    # Sortable fund table
│   ├── Charts.tsx       # Pie, bar, heatmap charts
│   ├── WeeklySignals.tsx # Top 3 + all signals
│   ├── Portfolio.tsx    # Holdings tracker
│   ├── RiskAnalysis.tsx # Risk metrics
│   └── Logs.tsx         # System logs
├── hooks/
│   └── useEngine.ts     # Main state management
├── services/
│   ├── amfiApi.ts       # Real AMFI API integration
│   └── supabase.ts      # Database service
├── utils/
│   ├── calculations.ts  # Returns, risk calculations
│   ├── aiEngine.ts      # AI scoring algorithm
│   └── mockData.ts      # Simulated data generator
├── data/
│   └── funds.ts         # 15 fixed funds database
├── types/
│   └── index.ts         # TypeScript types
└── App.tsx              # Main application
```

---

## 🔧 API Integration

### AMFI India (Live NAV)
- **Endpoint**: `https://www.amfiindia.com/spages/NAVAll.txt`
- **Updates**: Daily at 11 PM IST
- **Fallback**: CORS proxies for browser access

### mfapi.in (Historical Data)
- **Endpoint**: `https://api.mfapi.in/mf/{scheme_code}`
- **Data**: Full NAV history
- **Free**: No authentication required

---

## 📊 AI Scoring Algorithm

```
Overall Score = 
    Return Score (30%) +
    Risk Score (20%) +
    Momentum Score (25%) +
    Consistency Score (15%) +
    Drawdown Score (10%)
```

### Signal Mapping
| Score | Signal |
|-------|--------|
| 80-100 | Strong Buy |
| 65-79 | Buy |
| 50-64 | Accumulate |
| 35-49 | Hold |
| 0-34 | Avoid |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build**: Vite 7.3
- **Database**: Supabase (optional)
- **Hosting**: Vercel (recommended)

---

## 📝 License

MIT License - Free for personal and commercial use.

---

## ⚠️ Disclaimer

This is an educational tool for investment analysis. 
Not financial advice. Always do your own research.
Past performance doesn't guarantee future results.

---

## 🙏 Credits

- NAV Data: [AMFI India](https://www.amfiindia.com)
- Historical API: [mfapi.in](https://www.mfapi.in)
- Icons: [Lucide](https://lucide.dev)

---

**Built with ❤️ for Indian Mutual Fund Investors**
