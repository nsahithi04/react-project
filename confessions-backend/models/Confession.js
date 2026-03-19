const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Confession", confessionSchema);
