const mongoose = require("mongoose");
const moment = require("moment");

const Journey = require("../models/Journey");
const Vehicle = require("../models/Vehicle");
const distance = require("../helpers/distance");

// Create a new journey
exports.createJourney = async (req, res, next) => {
  const { userId } = req.query;

  const { vehicleModel, vehicleLicensePlate } = req.body;

  const newVehicle = new Vehicle({
    model: vehicleModel,
    license_plate: vehicleLicensePlate
  });

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
    vehicle: newVehicle._id,
    capacityAvailable: req.body.capacityAvailable,
    departure: moment(req.body.departure).format("YYYY-MM-DD"),
    polyline: req.body.polyline
  });

  try {
    const saveVehicle = await newVehicle.save();
    const saveJourney = await newJourney.save();
    if (saveJourney && saveVehicle) {
      res.status(201).json({ error: 0, message: "Journey was created" });
    }
  } catch (err) {
    next(err);
  }
};

// Get best journeys
exports.getBestJourneys = async (req, res, next) => {
  const capacityRequired = req.body.capacityRequired;
  const departureStart = moment(req.body.departureStart).utc();
  const departureEnd = moment(req.body.departureEnd).utc();
  console.log(departureStart, departureEnd);

  try {
    const findJourneys = await Journey.find({
      capacityAvailable: {
        $gte: capacityRequired
      },
      departure: {
        $gte: departureStart,
        $lte: departureEnd
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

// Accept request for a particular journey
exports.acceptRequest = async (req, res, next) => {
  const { requestId, journeyId } = req.query;

  try {
  } catch (err) {
    next(err);
  }
};

// Get all journeys
exports.getAllJourneys = async (req, res, next) => {
  const { userId } = req.query;
  try {
    const journeys = await Journey.find({ posted_by: userId })
      .populate("vehicle")
      .select("-requested_by -accepted_requests")
      .sort({ created_at: -1 });
    res.status(200).json({ error: 0, journeys });
  } catch (err) {
    next(err);
  }
};
