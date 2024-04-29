const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		historyBrought: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				dateBrought: { type: Date, required: true },
			},
		],
		historyWatched: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
			},
		],
	},
	{
		timestamps: false,
	}
);
const History = mongoose.model("History", historySchema);
module.exports = History;
