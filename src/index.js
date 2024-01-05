const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const db = require("../src/config/db");
const bodyParser = require("body-parser");

//Connect Database
db.connect();

dotenv.config();
const port = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json())
routes(app);



app.get("/", (req, res) => {
    res.send("Hello world");
});



app.listen(port, () => {
    console.log("Server is running in port", +port);
});
