const router = require("express").Router();
const upload = require("multer")();

const journeyController = require("../controllers/journey");
const userController = require("../controllers/user");
const vehicleController = require("../controllers/vehicle");
const requestController = require("../controllers/request");

// Create a journey
router.route("/journey").post(upload.none(), journeyController.createJourney);
router
  .route("/journey/accept")
  .post(upload.none(), journeyController.acceptRequest);

// Create a new user
router.route("/user").post(upload.none(), userController.createUser);

// Logs in a user
router.route("/login").post(upload.none(), userController.login);

// Create a new vehicle
router.route("/vehicle").post(upload.none(), vehicleController.createVehicle);

// Get closest journeys
router.route("/journeys").get(upload.none(), journeyController.getBestJourneys);

// Create a new transport request
router.route("/request").post(upload.none(), requestController.createRequest);

module.exports = router;
