const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  phone: {
    type: String,
    required: true
  },
  journeys: [{ type: String, ref: "Journey" }],
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("User", userSchema, "Users");
