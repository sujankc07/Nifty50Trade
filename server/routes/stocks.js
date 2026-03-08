const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPopular,
  searchStock,
  getChart,
} = require("../controllers/stockController");

router.get("/popular", auth, getPopular);
router.get("/search/:symbol", auth, searchStock);
router.get("/chart/:symbol", auth, getChart);

module.exports = router;
