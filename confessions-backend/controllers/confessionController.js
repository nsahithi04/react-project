const Confession = require("../models/Confession");

exports.createConfession = async (req, res) => {
  try {
    const { title, description, senderPhone, receiverPhone } = req.body;

    if (!title || !description || !senderPhone || !receiverPhone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const confession = new Confession({
      title,
      description,
      senderPhone,
      receiverPhone,
    });

    const saved = await confession.save();

    res.json({ message: "Confession sent", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getConfessions = async (req, res) => {
  try {
    const { phone } = req.params;

    const confessions = await Confession.find({ receiverPhone: phone })
      .select("title description createdAt")
      .sort({ createdAt: -1 });

    res.json({ data: confessions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
