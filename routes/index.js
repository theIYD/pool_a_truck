const router = require("express").Router();

const journeyController = require("../controllers/journey");

// Create a journey
router.route("/journey").post(journeyController.createJourney);

module.exports = router;
