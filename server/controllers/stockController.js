const { getQuote, getHistory } = require("../utils/yahooFinance");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NSE_STOCKS = [
  { symbol: "BEL.NS", name: "Bharat Electronics" },
  { symbol: "ONGC.NS", name: "Oil & Natural Gas Corp" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "NTPC.NS", name: "NTPC" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries" },
  { symbol: "NESTLEIND.NS", name: "Nestle India" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies" },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corporation" },
  { symbol: "TECHM.NS", name: "Tech Mahindra" },
  { symbol: "WIPRO.NS", name: "Wipro" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto" },
  { symbol: "CIPLA.NS", name: "Cipla" },
  { symbol: "GRASIM.NS", name: "Grasim Industries" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints" },
  { symbol: "DRREDDY.NS", name: "Dr Reddys Laboratories" },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel" },
  { symbol: "TITAN.NS", name: "Titan Company" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance" },
  { symbol: "TMPV.NS", name: "Tata Motors" },
  { symbol: "MAXHEALTH.NS", name: "Max Healthcare" },
  { symbol: "JIOFIN.NS", name: "Jio Financial Services" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports & SEZ" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors" },
  { symbol: "TRENT.NS", name: "Trent" },
  { symbol: "COALINDIA.NS", name: "Coal India" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv" },
  { symbol: "LT.NS", name: "Larsen & Toubro" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance" },
  { symbol: "INDIGO.NS", name: "IndiGo" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
  { symbol: "SHRIRAMFIN.NS", name: "Shriram Finance" },
  { symbol: "ETERNAL.NS", name: "Eternal Ltd (Zomato)" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
];

// GET /api/stocks/popular
exports.getPopular = async (req, res) => {
  try {
    const BATCH_SIZE = 5;
    const stocks = [];

    for (let i = 0; i < NSE_STOCKS.length; i += BATCH_SIZE) {
      const batch = NSE_STOCKS.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(async (s) => {
          const q = await getQuote(s.symbol);
          return {
            symbol: s.symbol,
            name: s.name,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            high: q.regularMarketDayHigh,
            low: q.regularMarketDayLow,
            volume: q.regularMarketVolume,
          };
        }),
      );
      results.forEach((r) => {
        if (r.status === "fulfilled") stocks.push(r.value);
        else console.log("❌ Failed:", r.reason?.message);
      });
      // Small delay between batches only
      if (i + BATCH_SIZE < NSE_STOCKS.length) await sleep(300);
    }

    console.log(`✅ Fetched ${stocks.length}/${NSE_STOCKS.length} stocks`);
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch stocks", error: err.message });
  }
};

// GET /api/stocks/search/:symbol
exports.searchStock = async (req, res) => {
  const base = req.params.symbol.toUpperCase();
  const symbol = `${base}.NS`;

  try {
    const q = await getQuote(symbol);
    return res.json({
      symbol,
      name: q.longName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      high: q.regularMarketDayHigh,
      low: q.regularMarketDayLow,
      volume: q.regularMarketVolume,
    });
  } catch (err) {
    res.status(404).json({
      msg: `"${base}" not found. Only Nifty 50 stocks are supported e.g. RELIANCE, TCS, INFY`,
    });
  }
};

// GET /api/stocks/chart/:symbol
exports.getChart = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase() + ".NS";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
    const result = await require("axios").get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const q = result.data.chart.result[0];
    const timestamps = q.timestamp;
    const ohlc = q.indicators.quote[0];

    const chart = timestamps
      .map((t, i) => ({
        date: new Date(t * 1000).toISOString().split("T")[0],
        open: +(ohlc.open[i] || 0).toFixed(2),
        high: +(ohlc.high[i] || 0).toFixed(2),
        low: +(ohlc.low[i] || 0).toFixed(2),
        close: +(ohlc.close[i] || 0).toFixed(2),
      }))
      .filter((d) => d.close > 0);

    res.json(chart);
  } catch (err) {
    console.log("Chart error:", err.message);
    res.json([]);
  }
};
