const axios = require('axios');

const getQuote = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 10000,
  });

  const meta = res.data.chart.result[0].meta;
  const price     = +meta.regularMarketPrice.toFixed(2);
  const prevClose = +meta.previousClose.toFixed(2);
  const change    = +(price - prevClose).toFixed(2);
  const changePct = +(((price - prevClose) / prevClose) * 100).toFixed(2);

  return {
    regularMarketPrice:         price,
    regularMarketChange:        change,
    regularMarketChangePercent: changePct,
    regularMarketDayHigh:       meta.regularMarketDayHigh  || 0,
    regularMarketDayLow:        meta.regularMarketDayLow   || 0,
    regularMarketVolume:        meta.regularMarketVolume   || 0,
    longName:                   meta.longName || meta.shortName || symbol,
  };
};

const getHistory = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 10000,
  });

  const result     = res.data.chart.result[0];
  const timestamps = result.timestamp;
  const ohlc       = result.indicators.quote[0];

  return timestamps.map((t, i) => ({
    date:  new Date(t * 1000).toISOString().split('T')[0],
    open:  +(ohlc.open[i]  || 0).toFixed(2),
    high:  +(ohlc.high[i]  || 0).toFixed(2),
    low:   +(ohlc.low[i]   || 0).toFixed(2),
    close: +(ohlc.close[i] || 0).toFixed(2),
  })).filter(d => d.close > 0);
};

module.exports = { getQuote, getHistory };