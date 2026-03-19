const Confession = require("../models/Confession");

exports.createConfession = async (req, res) => {
  try {
    const { title, description, senderEmail, receiverEmail } = req.body;

    if (!title || !description || !senderEmail || !receiverEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const confession = new Confession({
      title,
      description,
      senderEmail,
      receiverEmail,
    });
    const saved = await confession.save();
    res.json({ message: "Confession sent", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getConfessions = async (req, res) => {
  try {
    const { email } = req.params;
    const confessions = await Confession.find({ receiverEmail: email })
      .select("title description createdAt")
      .sort({ createdAt: -1 });
    res.json({ data: confessions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSentConfessions = async (req, res) => {
  try {
    const { email } = req.params;
    const confessions = await Confession.find({ senderEmail: email })
      .select("title receiverEmail description createdAt")
      .sort({ createdAt: -1 });
    res.json({ data: confessions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
