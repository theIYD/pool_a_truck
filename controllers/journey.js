const mongoose = require("mongoose");
const moment = require("moment");

const Journey = require("../models/Journey");
const distance = require("../helpers/distance");

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
    departure: moment(req.body.departure).format("x"),
    polyline: req.body.polyline
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

// Get best journeys
exports.getBestJourneys = async (req, res, next) => {
  const capacityRequired = req.body.capacityRequired;

  try {
    const findJourneys = await Journey.find({
      capacityAvailable: {
        $gte: capacityRequired
      }
    });

    let result = distance(findJourneys, req.body.source, req.body.dest);
    if (result.length === 0) {
      return res
        .status(200)
        .json({ error: 0, message: "No journeys found near you" });
    }
    res.status(200).json({ error: 0, journeys: result });
  } catch (err) {
    next(err);
  }
};
