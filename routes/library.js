const express = require("express");
const router = express.Router();
const {addlibrary,viewlibrary,nearestlibrary,addSeats,addPrice,dispalaySeats} = require("../Controllers/library")
const {auth,isStudent,isOwner} = require("../middlewares/auth")

// add library here by the owneer and view
router.post("/addlibrary",auth,isOwner, addlibrary)
router.get("/viewlibrary",auth,isOwner, viewlibrary)

// get  nearest librray by user's longitude and latitudde
router.post("/nearestlibrary",nearestlibrary)


router.post("/displayseats",dispalaySeats)



// add and mnage seats by the ownr 
router.post("/addseat",auth,isOwner,addSeats)
// add and mnage seats by the ownr 
router.post("/addprice",auth,isOwner,addPrice)


module.exports = router 