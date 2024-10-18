const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/RatingController");

router.post("/create", ratingController.createRating);
router.put("/update", ratingController.updateRating);

module.exports = router;
