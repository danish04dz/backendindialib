const express = require("express");
const router = express.Router();

const {auth,isStudent,isOwner,isAdmin} = require("../middlewares/auth")
const {updateProfile,getAllUserDetails,getAllUsers,updateRole} = require("../Controllers/Profile")


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// get User details and update

router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

// get all  users name email role by admin by admin
// Fetch all users (admin only)
router.get("/all-users", auth, isAdmin, getAllUsers);

router.put("/update-role", auth, isAdmin, updateRole);




module.exports = router