const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  type: { type: String, required: true, index: { unique: true } },
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Vehicle", vehicleSchema, "Vehicles");
