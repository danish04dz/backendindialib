const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
    libraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Library",
        required: true
    },
    
   
    price: {
        oneHour: {
            type: Number,
            required: true,
            min: 0,  // Optional: You can set a minimum value
        },
        twoHours: {
            type: Number,
            required: true,
            min: 0,
        },
        oneDay: {
            type: Number,
            required: true,
            min: 0,
        },
        twoDays: {
            type: Number,
            required: true,
            min: 0,
        },
        oneWeek: {
            type: Number,
            required: true,
            min: 0,
        },
        oneMonth: {
            type: Number,
            required: true,
            min: 0,
        }
    }
});

module.exports = mongoose.model("Price", priceSchema);
