const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    year:{
        type: Number
    },
    name:{
        type: String
    },
    coverart:{
        type: String
    },
    description:{
        type: String
    },
    inreviewqueue:{
        type: Boolean
    },
    platform:{
        type: Schema.Types.ObjectId, ref: "platform"
    } 
});

module.exports = Game = mongoose.model("game", GameSchema);
