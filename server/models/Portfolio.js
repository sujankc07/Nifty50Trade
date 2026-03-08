const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  companyName: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  avgBuyPrice: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

PortfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model("Portfolio", PortfolioSchema);
