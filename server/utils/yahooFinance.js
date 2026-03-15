const axios = require("axios");

const getQuote = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const meta = res.data.chart.result[0].meta;

  console.log("META:", JSON.stringify(meta, null, 2));
  const price = +meta.regularMarketPrice.toFixed(2);
  const prevClose = +meta.previousClose.toFixed(2);
  const change = +(price - prevClose).toFixed(2);
  const changePercent = +(((price - prevClose) / prevClose) * 100).toFixed(2);

  return {
    regularMarketPrice: price,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketDayHigh: meta.regularMarketDayHigh || 0,
    regularMarketDayLow: meta.regularMarketDayLow || 0,
    regularMarketVolume: meta.regularMarketVolume || 0,
    longName: meta.longName || meta.shortName || symbol,
  };
};

const getHistory = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const result = res.data.chart.result[0];
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;
  return timestamps
    .map((t, i) => ({
      date: new Date(t * 1000).toISOString().split("T")[0],
      close: closes[i],
    }))
    .filter((d) => d.close !== null);
};

module.exports = { getQuote, getHistory };
