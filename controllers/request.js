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
        start: moment(departureStart).format("x"),
        end: moment(departureEnd).format("x")
      }
    });

    const saveRequest = await newRequest.save();
    if (saveRequest) {
      res.status(201).json({
        error: 0,
        message: "Request was registered",
        request
      });
    }
  } catch (err) {
    next(err);
  }
};
