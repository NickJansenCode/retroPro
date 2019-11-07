const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
    reporter: {type: Schema.Types.ObjectId, ref: "user"},
    reported: {type: Schema.Types.ObjectId, ref: "user"}
});

module.exports = Friendship = mongoose.model("friendship", FriendshipSchema);
