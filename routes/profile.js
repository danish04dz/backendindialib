const express = require("express");
const router = express.Router();

const {auth,isStudent,isOwner} = require("../middlewares/auth")
const {updateProfile,getAllUserDetails} = require("../Controllers/Profile")


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// get User details and update

router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)


module.exports = router