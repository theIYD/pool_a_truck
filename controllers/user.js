const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone
    });

    const saveUser = await newUser.save();
    if (saveUser) {
      res.status(201).json({ error: 0, message: "New user created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (user) {
      return res.status(200).json({ error: 0, user });
    } else {
      res.status(200).json({ error: 0, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};
