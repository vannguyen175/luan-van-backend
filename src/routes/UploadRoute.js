const express = require("express");
const cloudinary = require("../config/middleware/cloundiary.config");
const upload = require("../config/middleware/multer");
const uploadMultiple = require("../config/middleware/uploader");
const router = express.Router();

router.post("/image", upload.array("images"), uploadMultiple);

module.exports = router;
