const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameCommentSchema = new Schema({
     commenter: {type: Schema.Types.ObjectId, ref: "user"},
     game: [{type: Schema.Types.ObjectId, ref: "game"}],
     text: {type: String},
     timestamp: {type: Number}
});

module.exports = GameComment = mongoose.model("gamecomment", GameCommentSchema);
