const User = require("../models/User")
const Profile = require("../models/Profile")

const mongoose = require("mongoose")


// Method for updating a profile
exports.updateProfile = async (req, res) => {
    try {
      const {
        name = "",
        
        dateOfBirth = "",
        about = "",
        
        gender = "",
      } = req.body
      const id = req.user.id
  
      // Find the profile by id
      const userDetails = await User.findById(id)
      const profile = await Profile.findById(userDetails.additionalDetails)
  
      const user = await User.findByIdAndUpdate(id, {
        name
        
      })
      await user.save()
  
      // Update the profile fields
      profile.dateOfBirth = dateOfBirth
      profile.about = about
     
      profile.gender = gender
  
      // Save the updated profile
      await profile.save()
  
      // Find the updated user details
      const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
  
      return res.json({
        success: true,
        message: "Profile updated successfully",
        updatedUserDetails,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }

  
exports.getAllUserDetails = async (req, res) => {
    try {
      const id = req.user.id
      const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
      console.log(userDetails)
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.getAllUsers = async (req, res) => {
    try {
        // Find all users and project only their name, email, and role fields
        const users = await User.find({}, { name: 1, email: 1, role: 1 });

        // If users are found, return the list of users
        return res.status(200).json({
            success: true,
            message: "List of all users fetched successfully",
            users
        });
    } catch (error) {
        // In case of an error, return a failure message and error details
        return res.status(500).json({
            success: false,
            message: "Error fetching user list",
            error: error.message
        });
    }
};



// update role [Student,Owner] of the user by admin

// Controller to update the role of a user by admin
exports.updateRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Validate the role
    const validRoles = ["Student", "Owner"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Valid roles are 'Student' or 'Owner'."
      });
    }

    // Find the user by ID and update their role
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true }
    );

    // If user not found, return error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Respond with success and the updated user details
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user
    });

  } catch (error) {
    // Handle errors and return error response
    return res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message
    });
  }
};
