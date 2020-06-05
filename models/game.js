var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    name: String,
    image: String,
    genre:String,
    description: String,
    category:String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
});

module.exports = mongoose.model("Game",gameSchema);