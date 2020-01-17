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
  isFragile: { type: Boolean, required: true },
  isPerishable: { type: Boolean, required: true },
  capacity: { type: Number, required: true },
  departure: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  journeyId: { type: mongoose.Types.ObjectId, ref: "Journey" },
  isJourney: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Request", requestSchema, "Requests");
