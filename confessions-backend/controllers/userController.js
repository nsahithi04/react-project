const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const name = req.body.name.trim().toLowerCase();
    const phone = req.body.phone.trim();

    let user = await User.findOne({ phone });

    // If user already exists
    if (user) {
      // If name changed → update name
      if (user.name !== name) {
        user.name = name;
        await user.save();

        return res.json({
          message: "Name updated",
          data: user,
          isNewUser: false,
          updated: true,
        });
      }

      // User exists and name is same
      return res.json({
        message: "User already exists",
        data: user,
        isNewUser: false,
      });
    }

    // If user does not exist → create new user
    user = new User({ name, phone });
    const savedUser = await user.save();

    return res.json({
      message: "User created",
      data: savedUser,
      isNewUser: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateName = async (req, res) => {
  try {
    const { phone, name } = req.body;
    const user = await User.findOneAndUpdate(
      { phone },
      { name: name.trim().toLowerCase() },
      { returnDocument: "after" },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Name updated", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const staticOtp = 123456;

  try {
    const { otp } = req.body;

    if (Number(otp) === staticOtp) {
      return res.json({ success: true });
    }

    return res.json({ success: false, message: "Invalid OTP" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
