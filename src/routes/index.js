const userRoute = require ("./UserRoute")

const routes = (app) => {
    app.post("/user", userRoute);
};

module.exports = routes;
