const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
     reviewer: {type: Schema.Types.ObjectId, ref: "user"},
     game: {type: Schema.Types.ObjectId, ref: "game"},
     rating: {type: Number},
     title: {type: String},
     text: {type: String},
     timestamp: {type: Number}
});

module.exports = Review = mongoose.model("review", ReviewSchema);
