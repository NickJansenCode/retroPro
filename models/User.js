const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilepicture:{
        type: String,
        required: false
    },
    headerpicture:{
        type: String,
        required: false
    },
    about:{
        type: String,
        required: false
    },
    isbanned:{
        type: Boolean,
        required: true,
        default: false
    },
    gameCollection:{
        type: Schema.Types.ObjectId, ref: "collection"
    }
});

module.exports = User = mongoose.model("users", UserSchema);
