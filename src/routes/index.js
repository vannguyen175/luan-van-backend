const userRoute = require ("./UserRoute")

const routes = (app) => {
    app.use("/user", userRoute);
};

module.exports = routes;
