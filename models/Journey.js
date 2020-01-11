const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journeySchema = new Schema({});

module.exports = mongoose.model("Journey", journeySchema, "journeys");
