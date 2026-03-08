const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPortfolio,
  resetPortfolio,
} = require("../controllers/portfolioController");

router.get("/", auth, getPortfolio);
router.post("/reset", auth, resetPortfolio);
module.exports = router;
