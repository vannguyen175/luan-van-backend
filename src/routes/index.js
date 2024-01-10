const userRoute = require ("./UserRoute")
const productRoute = require ("./ProductRoute")
const categoryRoute = require ("./CategoryRoute")
const subCategoryRoute = require ("./SubCategoryRoute")

const routes = (app) => {
    app.use("/user", userRoute);
    app.use("/product", productRoute);
    app.use("/category", categoryRoute);
    app.use("/sub-category", subCategoryRoute);
};

module.exports = routes;
