const axios = require("axios");
const Watchlist = require("../models/Watchlist");
const { getQuote } = require("../utils/yahooFinance");

// GET /api/watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const wl = await Watchlist.findOne({ userId: req.user.id });
    if (!wl || wl.symbols.length === 0) return res.json([]);

    console.log("Watchlist symbols:", wl.symbols);

    const stocks = await Promise.allSettled(
      wl.symbols.map(async (sym) => {
        // Add .NS if not present
        const symbol = sym.endsWith(".NS") ? sym : `${sym}.NS`;
        const q = await getQuote(symbol);
        return {
          symbol,
          name: q.longName,
          price: q.regularMarketPrice,
          change: q.regularMarketChange,
          changePercent: q.regularMarketChangePercent,
        };
      }),
    );

    const result = stocks
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    console.log(`✅ Watchlist fetched ${result.length} stocks`);
    res.json(result);
  } catch (err) {
    console.log("Watchlist error:", err.message);
    res.status(500).json({ msg: "Failed to fetch watchlist" });
  }
};

// POST /api/watchlist/:symbol
exports.addToWatchlist = async (req, res) => {
  try {
    // Store without .NS — clean symbol only
    const symbol = req.params.symbol.toUpperCase().replace(".NS", "");
    let wl = await Watchlist.findOne({ userId: req.user.id });
    if (!wl) wl = await Watchlist.create({ userId: req.user.id, symbols: [] });

    if (!wl.symbols.includes(symbol)) {
      wl.symbols.push(symbol);
      await wl.save();
    }

    console.log(`✅ Added ${symbol} to watchlist`);
    res.json({ msg: "Added to watchlist", symbols: wl.symbols });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update watchlist" });
  }
};

// DELETE /api/watchlist/:symbol
exports.removeFromWatchlist = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase().replace(".NS", "");
    const wl = await Watchlist.findOne({ userId: req.user.id });
    if (wl) {
      wl.symbols = wl.symbols.filter((s) => s !== symbol);
      await wl.save();
    }
    res.json({ msg: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update watchlist" });
  }
};
