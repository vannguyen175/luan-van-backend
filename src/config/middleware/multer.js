const Multer = require("multer");
// const upload = require("./uploader")


const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

module.exports = storage;
module.exports = upload;