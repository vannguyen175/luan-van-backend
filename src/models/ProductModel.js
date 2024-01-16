const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sub_category",
            required: true,
        },
        price: { type: Number, required: true },
        description: { type: String },
        selled: { type: Boolean }, //tinh trang hang da duoc ban hay chua
    },
    {
        timestamps: false,
    }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
