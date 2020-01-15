const mongoose = require("mongoose");
const moment = require("moment");

const Request = require("../models/Request");

// Create a new request
exports.createRequest = async (req, res, next) => {
  const {
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    capacity,
    departureStart,
    departureEnd
  } = req.body;
  const { userId } = req.query;
  console.log(
    moment(departureStart, "YYYY-MM-DD"),
    moment(departureEnd, "YYYY-MM-DD"),
    moment().toString()
  );
  try {
    const newRequest = new Request({
      userId: mongoose.Types.ObjectId(userId),
      start: {
        lat: sourceLat,
        lng: sourceLng
      },
      end: {
        lat: destLat,
        lng: destLng
      },
      capacity,
      departure: {
        start: moment(departureStart).format("YYYY-MM-DD"),
        end: moment(departureEnd).format("YYYY-MM-DD")
      }
    });

    const saveRequest = await newRequest.save();
    if (saveRequest) {
      res.status(201).json({
        error: 0,
        message: "Request was registered",
        saveRequest
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get all requests for a particular user
exports.getRequestsByUser = async (req, res, next) => {
  const { userId } = req.query;

  try {
    const requests = await Request.find({ userId });
    if (requests.length !== 0) {
      res.status(200).json({ error: 0, requests });
    }
  } catch (err) {
    next(err);
  }
};
