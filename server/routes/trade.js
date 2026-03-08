const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { buy, sell, getHistory } = require("../controllers/tradeController");

router.post("/buy", auth, buy);
router.post("/sell", auth, sell);
router.get("/history", auth, getHistory);

module.exports = router;
