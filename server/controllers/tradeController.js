const { getQuote } = require("../utils/yahooFinance.js");
const User = require("../models/User.js");
const Portfolio = require("../models/Portfolio.js");
const Transaction = require("../models/Transaction.js");

// POST /api/trade/buy
exports.buy = async (req, res) => {
  const { symbol, quantity } = req.body;
  if (!symbol || !quantity || quantity < 1)
    return res.status(400).json({ msg: "Invalid symbol or quantity" });

  try {
    const q = await getQuote(symbol);
    const price = q.regularMarketPrice;
    const total = +(price * quantity).toFixed(2);

    const user = await User.findById(req.user.id);
    if (user.balance < total)
      return res.status(400).json({
        msg: `Insufficient balance. Need ₹${total}, have ₹${user.balance.toFixed(2)}`,
      });

    user.balance = +(user.balance - total).toFixed(2);
    await user.save();

    const existing = await Portfolio.findOne({ userId: req.user.id, symbol });
    if (existing) {
      const newQty = existing.quantity + quantity;
      const newAvgPrice = +(
        (existing.avgBuyPrice * existing.quantity + total) /
        newQty
      ).toFixed(2);
      existing.quantity = newQty;
      existing.avgBuyPrice = newAvgPrice;
      existing.updatedAt = new Date();
      await existing.save();
    } else {
      await Portfolio.create({
        userId: req.user.id,
        symbol,
        companyName: q.longName,
        quantity,
        avgBuyPrice: +price.toFixed(2),
      });
    }

    await Transaction.create({
      userId: req.user.id,
      symbol,
      companyName: q.longName || q.shortName || symbol,
      type: "BUY",
      quantity,
      price: +price.toFixed(2),
      total,
    });

    res.json({
      msg: `Successfully bought ${quantity} shares of ${symbol}`,
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ msg: "Trade failed", error: err.message });
  }
};

// POST /api/trade/sell
exports.sell = async (req, res) => {
  const { symbol, quantity } = req.body;
  if (!symbol || !quantity || quantity < 1)
    return res.status(400).json({ msg: "Invalid symbol or quantity" });

  try {
    const holding = await Portfolio.findOne({ userId: req.user.id, symbol });
    if (!holding || holding.quantity < quantity)
      return res
        .status(400)
        .json({ msg: `Not enough shares. You own ${holding?.quantity || 0}` });

    const q = await getQuote(symbol);
    const price = q.regularMarketPrice;
    const total = +(price * quantity).toFixed(2);

    const user = await User.findById(req.user.id);
    user.balance = +(user.balance + total).toFixed(2);
    await user.save();

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      holding.updatedAt = new Date();
      await holding.save();
    }

    await Transaction.create({
      userId: req.user.id,
      symbol,
      companyName: q.longName,
      type: "SELL",
      quantity,
      price: +price.toFixed(2),
      total,
    });

    res.json({
      msg: `Successfully sold ${quantity} shares of ${symbol}`,
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ msg: "Trade failed", error: err.message });
  }
};

// GET /api/trade/history
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ userId: req.user.id });
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      transactions,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch history" });
  }
};
