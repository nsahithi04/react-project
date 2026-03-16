require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const confessionRoutes = require("./routes/confessionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", userRoutes);
app.use("/", confessionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
