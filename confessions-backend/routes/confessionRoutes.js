const express = require("express");
const router = express.Router();
const confessionController = require("../controllers/confessionController");

router.post("/confessions", confessionController.createConfession);
router.get("/confessions/:phone", confessionController.getConfessions);

module.exports = router;
