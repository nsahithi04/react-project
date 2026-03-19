const User = require("../models/User");

// Called after Firebase signup — stores user in MongoDB
exports.createUser = async (req, res) => {
  try {
    const { uid, name, email } = req.body; // no password
    const existing = await User.findOne({ uid });
    if (existing)
      return res.json({ message: "User already exists", data: existing });

    const user = new User({
      uid,
      name: name.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
    });
    const saved = await user.save();
    res.json({ message: "User created", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByUid = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateName = async (req, res) => {
  try {
    const { uid, name } = req.body;
    const user = await User.findOneAndUpdate(
      { uid },
      { name: name.trim().toLowerCase() },
      { returnDocument: "after" },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Name updated", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
