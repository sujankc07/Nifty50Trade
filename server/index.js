const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/trade", require("./routes/trade"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/watchlist", require("./routes/watchlist"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "🟢 Nifty50Trade server is running!" }),
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
