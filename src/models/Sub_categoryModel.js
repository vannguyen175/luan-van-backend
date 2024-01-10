const mongoose = require("mongoose");

const sub_categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

const Sub_category = mongoose.model("Sub_category", sub_categorySchema);

module.exports = Sub_category;
