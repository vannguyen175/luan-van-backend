const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/middleware/multer");
const uploadMultiple = require("../config/middleware/uploader");

router.post("/create", uploadCloud.array("images"), uploadMultiple);

module.exports = router;
