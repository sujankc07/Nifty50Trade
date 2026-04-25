const axios = require('axios');

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

const getQuote = async (symbol) => {
  // Convert NSE symbol format: RELIANCE.NS -> RELIANCE:NSE
  const sym = symbol.replace('.NS', ':NSE');
  
  const res = await axios.get(`${BASE_URL}/quote`, {
    params: {
      symbol: sym,
      apikey: API_KEY,
    }
  });

  const d = res.data;

  if (d.status === 'error') throw new Error(d.message);

  const price      = +parseFloat(d.close).toFixed(2);
  const prevClose  = +parseFloat(d.previous_close).toFixed(2);
  const change     = +(price - prevClose).toFixed(2);
  const changePct  = +(((price - prevClose) / prevClose) * 100).toFixed(2);

  return {
    regularMarketPrice:         price,
    regularMarketChange:        change,
    regularMarketChangePercent: changePct,
    regularMarketDayHigh:       +parseFloat(d.high).toFixed(2),
    regularMarketDayLow:        +parseFloat(d.low).toFixed(2),
    regularMarketVolume:        +d.volume || 0,
    longName:                   d.name || sym,
  };
};

const getHistory = async (symbol) => {
  const sym = symbol.replace('.NS', ':NSE');

  const res = await axios.get(`${BASE_URL}/time_series`, {
    params: {
      symbol:     sym,
      interval:   '1day',
      outputsize: 30,
      apikey:     API_KEY,
    }
  });

  const d = res.data;
  if (d.status === 'error') throw new Error(d.message);

  return d.values.map(v => ({
    date:  v.datetime,
    open:  +parseFloat(v.open).toFixed(2),
    high:  +parseFloat(v.high).toFixed(2),
    low:   +parseFloat(v.low).toFixed(2),
    close: +parseFloat(v.close).toFixed(2),
  })).reverse(); // oldest to newest for chart
};

module.exports = { getQuote, getHistory };