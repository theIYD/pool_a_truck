const Vehicle = require("../models/Vehicle");

exports.createVehicle = async (req, res, next) => {
  const newVehicle = new Vehicle({
    type: req.body.type
  });

  try {
    const saveVehicle = await newVehicle.save();
    if (saveVehicle) {
      res.status(201).json({ error: 0, message: "Vehicle was created" });
    }
  } catch (err) {
    next(err);
  }
};
