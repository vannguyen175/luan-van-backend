const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const db = require("../src/config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const Multer = require("multer");
const cloudinary = require("cloudinary").v2;

//Connect Database
db.connect();

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "35mb" }));
routes(app);

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
	const res = await cloudinary.uploader.upload(file, {
		resource_type: "auto",
	});
	return res;
}

const storage = new Multer.memoryStorage();
const upload = Multer({
	storage,
});

app.post("/upload", upload.single("my_file"), async (req, res) => {
	try {
		const b64 = Buffer.from(req.file.buffer).toString("base64");
		let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
		const cldRes = await handleUpload(dataURI);
		res.json(cldRes);
	} catch (error) {
		console.log(error);
		res.send({
			message: error.message,
		});
	}
});

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log("Server is running in port", +port);
});
