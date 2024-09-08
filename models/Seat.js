
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({

    seatnumber : {
        type : String,
        

    },
    row : {
        type : String,
        

    },
    column : {
        type :String,
        
    },
    libraryid :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Library",
        
        
        
    },
    isAvailable : {
        type : Boolean,
        default : true,
    },
    isBooked : {
        type : Boolean,
        default :false,
    },
    bookedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null,
    },
    bookedAt : {
        type : Date,
        default : null,

    },
    bookingDuration : {
        type : String,
        // enum : ["1 hour", "2 hours", "5 hours", "1 day", "2 days", "1 week", "1 month"],
        default : null,
        required: false,
    },

    

})


module.exports = mongoose.model("Seat", seatSchema);