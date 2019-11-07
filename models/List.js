const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: string
    }, 
    items: [{type: Schema.Types.ObjectId, ref: "game"}]
});

module.exports = List = mongoose.model("list", ListSchema);
