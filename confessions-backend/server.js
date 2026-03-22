const connectDB = require("./config/db");
const app = require("./app");

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
