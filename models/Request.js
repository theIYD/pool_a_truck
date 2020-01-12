const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  start: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  end: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  capacity: { type: Number, required: true },
  departure: { type: Date, required: true },
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Request", requestSchema, "Requests");
