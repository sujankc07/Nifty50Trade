const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbols: [{ type: String }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);
