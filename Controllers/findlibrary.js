const User = require("../models/User");
const Library = require("../models/Library");
const Seat = require("../models/Seat");
const Price =require ("../models/Price")


// ==============================================
// ===                                      ====
// ==          find library by city name     ====
// ==                                       ====
// ============================================= 

exports.libraryByCity = async (req,res) => {
    try {
        const {city} =req.body
        // get library Data
    const libraryData = await Library.find({ city:city })
    .populate("otherLibraryData").populate("priceAccordingToDuration")
       .exec()


       

       return res.status(200).json({
         success: true,
         data: libraryData,
       })
   
 } catch (error) {
   console.error(error)
   return res.status(500).json({
    success: false,
    message: "Error retrieving library by city",
  });
   
 }
}

// ==============================================
// ===                                      ====
// ==          find library by pin     ====
// ==                                       ====
// ============================================= 

exports.libraryByPin = async (req,res) => {
    try {
        const {pin} =req.body
        // get library Data
    const libraryData = await Library.find({ pin:pin })
    .populate("otherLibraryData").populate("priceAccordingToDuration")
       .exec()


       

       return res.status(200).json({
         success: true,
         data: libraryData,
       })
   
 } catch (error) {
   console.error(error)
   return res.status(500).json({
    success: false,
    message: "Error retrieving library by city",
  });
   
 }
}