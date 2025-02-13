const mongoose = require("mongoose");
const moment = require("moment");

const User = require("../models/User");
const Request = require("../models/Request");
const Journey = require("../models/Journey");

const distance = require("../helpers/distance");
// Create a new request
exports.createRequest = async (req, res, next) => {
  const {
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    capacity,
    departureStart,
    departureEnd,
    isPerishable,
    isFragile
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
      isFragile,
      isPerishable,
      departure: {
        start: new Date(departureStart),
        end: new Date(departureEnd)
      }
    });

    const saveRequest = await newRequest.save();
    if (saveRequest) {
      let journey = null;
      // 1. Find journeys having their creation date less than departure date of this request
      if (saveRequest.isPerishable) {
        journey = await Journey.find({
          // created_at: {
          //   $lte: saveRequest.departure.start
          // },
          departure: {
            $gte: saveRequest.departure.start,
            $lte: saveRequest.departure.end
          },
          isPerishable: true,
          isFragile: false
        });
        console.log("IsPerishable");
        console.log(journey);
      } else if (saveRequest.isFragile) {
        journey = await Journey.find({
          created_at: {
            $lte: saveRequest.departure.start
          },
          departure: {
            $gte: saveRequest.departure.start,
            $lte: saveRequest.departure.end
          },
          isPerishable: false,
          isFragile: true
        });
        console.log("isFragile");
        console.log(journey);
      } else if (saveRequest.isFragile && saveRequest.isPerishable) {
        journey = await Journey.find({
          created_at: {
            $lte: saveRequest.departure.start
          },
          departure: {
            $gte: saveRequest.departure.start,
            $lte: saveRequest.departure.end
          },
          isPerishable: true,
          isFragile: true
        });
        console.log("IsPerishable and IsFragile");
        console.log(journey);
      } else {
        journey = await Journey.find({
          created_at: {
            $lte: saveRequest.departure.start
          },
          departure: {
            $gte: saveRequest.departure.start,
            $lte: saveRequest.departure.end
          },
          isPerishable: false,
          isFragile: false
        });
        console.log("No Fragile and No Perishable");
        console.log(journey);
      }

      if (journey.length !== 0) {
        let result = distance(
          journey,
          { lat: sourceLat, lng: sourceLng },
          { lat: destLat, lng: destLng }
        );
        console.log(result);
        if (!result) {
          return res
            .status(200)
            .json({ error: 0, message: "No closest journeys found near you" });
        } else {
          const requestId = saveRequest._id;
          const journeyToBeUpdated = await Journey.findOne({
            _id: result.journey._id
          });
          if (journeyToBeUpdated) {
            journeyToBeUpdated.capacityAvailable -= saveRequest.capacity;
            if (journeyToBeUpdated.capacityAvailable > 0) {
              const saveJourney = await journeyToBeUpdated.save();
              if (saveJourney) {
                const updateJourney = await Journey.findOneAndUpdate(
                  { _id: result.journey._id },
                  {
                    $push: {
                      requested_by: {
                        $each: [
                          { requestId, capacityRequired: saveRequest.capacity }
                        ]
                      },
                      accepted_requests: {
                        $each: [
                          { requestId, capacityRequired: saveRequest.capacity }
                        ]
                      },
                      waypoints: {
                        $each: [
                          {
                            latitude: saveRequest.start.lat,
                            longitude: saveRequest.start.lng
                          }
                          //   { latitude: request.end.lat, longitude: request.end.lng } For drop-off point before the journey destination
                        ]
                      }
                    }
                  },
                  { new: true }
                );
                if (updateJourney) {
                  const updateJourneyOfUser = await User.findOneAndUpdate(
                    {
                      _id: saveRequest.userId
                    },
                    {
                      $push: {
                        journeys: mongoose.Types.ObjectId(result.journey._id)
                      }
                    },
                    { new: true }
                  );

                  if (updateJourneyOfUser) {
                    saveRequest.journeyId = result.journey._id;
                    saveRequest.isJourney = true;
                    const updateJourneyIdInRequest = await saveRequest.save();
                    if (updateJourneyIdInRequest) {
                      return res.status(200).json({
                        error: 0,
                        message:
                          "Request registered and was assigned the closest journey",
                        journeyId: result.journey._id
                      });
                    }
                  }
                }
              }
            } else {
              return res
                .status(200)
                .json({ error: 1, message: "Capacity is going negative" });
            }
          }
        }
      } else {
        return res.status(200).json({
          error: 0,
          message: "No journey assigned yet, request is on wait !"
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

// Get all requests for a particular user
exports.getRequestsByUser = async (req, res, next) => {
  const { userId } = req.query;

  try {
    const requests = await Request.find({ userId })
      .populate({
        path: "journeyId",
        populate: { path: "vehicle posted_by", select: "-journeys" }
      })
      .sort({ created_at: -1 });
    res.status(200).json({ error: 0, requests });
  } catch (err) {
    next(err);
  }
};
