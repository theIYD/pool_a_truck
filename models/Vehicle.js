const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  model: { type: String, required: true },
  license_plate: { type: String, required: true, index: { unique: true } },
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Vehicle", vehicleSchema, "Vehicles");
