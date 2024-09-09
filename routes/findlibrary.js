const express = require("express");
const router = express.Router();

const {libraryByCity,libraryByPin} = require("../Controllers/findlibrary")



// get  nearest librray by user's longitude and latitudde
router.post("/city",libraryByCity)



router.post("/pin",libraryByPin)

module.exports = router 