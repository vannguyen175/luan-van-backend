const userRoute = require("./UserRoute");
const productRoute = require("./ProductRoute");
const categoryRoute = require("./CategoryRoute");
const subCategoryRoute = require("./SubCategoryRoute");

const routes = (app) => {
    app.use("/api/user", userRoute);
    app.use("/api/product", productRoute);
    app.use("/api/category", categoryRoute);
    app.use("/api/sub-category", subCategoryRoute);
};

module.exports = routes;
