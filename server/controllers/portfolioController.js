const { getQuote } = require("../utils/yahooFinance");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
// GET /api/portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const [holdings, user] = await Promise.all([
      Portfolio.find({ userId: req.user.id }),
      User.findById(req.user.id),
    ]);

    if (holdings.length === 0)
      return res.json({
        holdings: [],
        balance: user.balance,
        summary: { invested: 0, current: 0, pnl: 0, pnlPercent: 0 },
      });

    const enriched = await Promise.allSettled(
      holdings.map(async (h) => {
        const q = await getQuote(h.symbol);
        const currentPrice = q.regularMarketPrice;
        const currentValue = +(currentPrice * h.quantity).toFixed(2);
        const investedValue = +(h.avgBuyPrice * h.quantity).toFixed(2);
        const pnl = +(currentValue - investedValue).toFixed(2);
        const pnlPercent = +((pnl / investedValue) * 100).toFixed(2);

        return {
          symbol: h.symbol,
          companyName: h.companyName,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          currentPrice: +currentPrice.toFixed(2),
          currentValue,
          investedValue,
          pnl,
          pnlPercent,
          dayChange: +(q.regularMarketChange || 0).toFixed(2),
          dayChangePct: +(q.regularMarketChangePercent || 0).toFixed(2),
        };
      }),
    );

    const successHoldings = enriched
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const totalInvested = +successHoldings
      .reduce((s, h) => s + h.investedValue, 0)
      .toFixed(2);
    const totalCurrent = +successHoldings
      .reduce((s, h) => s + h.currentValue, 0)
      .toFixed(2);
    const totalPnL = +(totalCurrent - totalInvested).toFixed(2);
    const pnlPercent =
      totalInvested > 0 ? +((totalPnL / totalInvested) * 100).toFixed(2) : 0;

    res.json({
      holdings: successHoldings,
      balance: user.balance,
      summary: {
        invested: totalInvested,
        current: totalCurrent,
        pnl: totalPnL,
        pnlPercent,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch portfolio", error: err.message });
  }
};

exports.resetPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all holdings and transactions
    await Portfolio.deleteMany({ userId });
    await Transaction.deleteMany({ userId });

    // Reset balance to 1,00,000
    await User.findByIdAndUpdate(userId, { balance: 100000 });

    res.json({ msg: "Portfolio reset successfully!", balance: 100000 });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reset portfolio" });
  }
};
