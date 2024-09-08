const express = require("express");
const router = express.Router();
const {auth,isStudent,isOwner} = require("../middlewares/auth")
c
const { checkSeat } = require("../Controllers/CheckSeatAvailibilty");


// Create a new booking
router.post(
    "/check",
    auth,isStudent,
    checkSeat
  );



  module.exports =router