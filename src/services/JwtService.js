const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
    const access_token = jwt.sign(
        {
            ...payload,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "24h" }
    );

    return access_token;
};

module.exports = { genneralAccessToken };
