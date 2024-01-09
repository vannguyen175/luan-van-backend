const userRoute = require ("./UserRoute")
const productRoute = require ("./ProductRoute")
const categoryRoute = require ("./CategoryRoute")

const routes = (app) => {
    app.use("/user", userRoute);
    app.use("/product", productRoute);
    app.use("/category", categoryRoute);
};

module.exports = routes;
