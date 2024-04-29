const userRoute = require("./UserRoute");
const productRoute = require("./ProductRoute");
const categoryRoute = require("./CategoryRoute");
const subCategoryRoute = require("./SubCategoryRoute");
const orderRoute = require("./OrderRoute");
const cartRoute = require("./CartRoute");

const routes = (app) => {
    app.use("/api/user", userRoute);
    app.use("/api/product", productRoute);
    app.use("/api/category", categoryRoute);
    app.use("/api/sub-category", subCategoryRoute);
    app.use("/api/order", orderRoute);
    app.use("/api/cart", cartRoute);
};

module.exports = routes;
