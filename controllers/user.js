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
