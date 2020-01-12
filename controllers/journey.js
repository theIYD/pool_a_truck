const mongoose = require("mongoose");
const moment = require("moment");

const Journey = require("../models/Journey");

exports.createJourney = async (req, res, next) => {
  const { vehicleId, userId } = req.query;
  const newJourney = new Journey({
    posted_by: mongoose.Types.ObjectId(userId),
    start: {
      lat: req.body.sourceLat,
      lng: req.body.sourceLng
    },
    end: {
      lat: req.body.destLat,
      lng: req.body.destLng
    },
    vehicle: mongoose.Types.ObjectId(vehicleId),
    capacityAvailable: req.body.capacityAvailable,
    departure: moment(req.body.departure).format("x")
  });

  try {
    const saveJourney = await newJourney.save();
    if (saveJourney) {
      res.status(201).json({ error: 0, message: "Journey was created" });
    }
  } catch (err) {
    next(err);
  }
};
