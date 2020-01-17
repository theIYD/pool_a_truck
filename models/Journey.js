const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journeySchema = new Schema({
  posted_by: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
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
  departure: { type: Date, required: true },
  polyline: { type: String, required: true },
  vehicle: { type: mongoose.Types.ObjectId, required: true, ref: "Vehicle" },
  capacityAvailable: { type: Number, required: true, min: 0 },
  waypoints: [Object],
  requested_by: [
    {
      requestId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Request"
      },
      capacityRequired: { type: Number, required: false },
      created_at: { type: Date, default: Date.now() }
    }
  ],
  accepted_requests: [
    {
      requestId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "Request"
      },
      capacityRequired: { type: Number, required: false },
      created_at: { type: Date }
    }
  ],
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Journey", journeySchema, "journeys");
