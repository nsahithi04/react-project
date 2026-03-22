require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/userRoutes");
const confessionRoutes = require("./routes/confessionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", confessionRoutes);

module.exports = app;
