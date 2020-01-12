const router = require("express").Router();
const upload = require("multer")();

const journeyController = require("../controllers/journey");
const userController = require("../controllers/user");
const vehicleController = require("../controllers/vehicle");

// Create a journey
router.route("/journey").post(upload.none(), journeyController.createJourney);

// Create a new user
router.route("/user").post(upload.none(), userController.createUser);

// Create a new vehicle
router.route("/vehicle").post(upload.none(), vehicleController.createVehicle);

module.exports = router;
