const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    senderPhone: { type: String, required: true },
    receiverPhone: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Confession", confessionSchema);
