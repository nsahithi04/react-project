const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const userController = require("../controllers/userController");

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { message: "Too many attempts, please try again later" },
// });

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/update-name", userController.updateName);
router.get("/users/:uid", userController.getUserByUid);

module.exports = router;
