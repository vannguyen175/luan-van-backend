const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderItems: {
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },

        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: Number, required: true },
        },

        paymentMethod: { type: String, required: true },
        itemPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPaid: { type: Boolean, default: false }, //da thanh toan hay chua
        paidAt: { type: Date }, //thoi diem thanh toan
        isDelivered: { type: Boolean, default: false }, //da giao hang chua
        deliveredAt: { type: Date }, //giao hang vao luc nao
    },
    {
        timestamps: true,
    }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
