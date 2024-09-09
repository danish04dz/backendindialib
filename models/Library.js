const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({

    library_name :{
        type : String,
        required : true,
    },
    owner_Id : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref : "User",
        
    },
    address : {
        type : String,
        required : true,
    },
    pin : {
        type :String,
        required : true,
    },
    city : {
        type : String,
        required : true,

    },
    thumbnail : {
        type :String
    },
    location : {
        type : {type:String,required:true},
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    about : {
        type: String,
        required : true,

    },
    otherLibraryData : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "Seat"
        
        
    },
    priceAccordingToDuration : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "Price"
    }


});

librarySchema.index({location:"2dsphere"})
module.exports = mongoose.model("library", librarySchema);