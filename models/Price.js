const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
    libraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Library",
      
    },
    
   
    price: {
        oneHour: {
            type: Number,
            
             // Optional: You can set a minimum value
        },
        twoHours: {
            type: Number,
            
        },
        oneDay: {
            type: Number,
            
        },
        twoDays: {
            type: Number,
            
        },
        oneWeek: {
            type: Number,
            
        },
        oneMonth: {
            type: Number,
            
        }
    }
});

module.exports = mongoose.model("Price", priceSchema);
