const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const confessionController = require("../controllers/confessionController");

const confessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: "Too many confessions sent, slow down" },
});

router.post(
  "/confessions",
  confessionLimiter,
  confessionController.createConfession,
);
router.get("/confessions/:email", confessionController.getConfessions);
router.get("/sent-confessions/:email", confessionController.getSentConfessions);

module.exports = router;
