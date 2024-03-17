const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const db = require("../src/config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");

//Connect Database
db.connect();

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "35mb" }));
routes(app);

// app.use(
// 	bodyParser.urlencoded({
// 		extended: true,
// 		limit: "35mb",
// 		parameterLimit: 50000,
// 	})
// );
app.use(fileupload({ useTempFiles: true }));

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log("Server is running in port", +port);
});
