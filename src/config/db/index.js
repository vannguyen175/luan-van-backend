const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/TradeGoods");

        console.log("Connect to database successfully!");
    } catch (error) {
        console.log(error);
    }

}

module.exports = { connect };
