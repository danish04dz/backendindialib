const express = require("express");
const router = express.Router();
const {auth,isStudent,isOwner} = require("../middlewares/auth")
const {createBooking, manageBookingByOwner,getBookingsByOwner,getBookingsByUser} = require("../Controllers/Booking")


// Create a new booking
router.post(
    "/book",
    auth,isStudent,
    createBooking
  );

  // Route to manage booking by owner
router.put("/managebooking", 
   auth,
   isOwner,
   manageBookingByOwner);


   router.get("/ownerviewbooking", auth, isOwner, getBookingsByOwner)

   router.get("/userviewbooking", auth,isStudent,   getBookingsByUser)
 






  module.exports =router