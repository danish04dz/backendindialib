const User = require("../models/User");
const Library = require("../models/Library");
const Seat = require("../models/Seat");
const Price =require ("../models/Price")
const { uploadImageToCloudinary } = require("../utils/imageUploader");



// ==============================================
// ===                                      ====
// ==          add/regiter librray           ====
// ==                                       ====
// ============================================= 

exports.addlibrary = async (req, res) => {
  try {
    // Get user ID from request object
    const ownerId = req.user.id;

    // Get all required fields from request body
    const { library_name, address, pin,city, longitude, latitude,about} = req.body;

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    // Get thumbnail image from request files
    const thumbnail = req.files?.thumbnailImage;

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required.",
      });
    }

    // Check if owner already registered a library
    const existingLibrary = await Library.findOne({ owner_Id: ownerId });

    if (existingLibrary) {
      return res.status(400).json({
        success: false,
        message: "Owner already registered a library",
      });
    }

    // Check if the user is an Owner
    const ownerDetails = await User.findById(ownerId);

    if (!ownerDetails || ownerDetails.role !== "Owner") {
      return res.status(404).json({
        success: false,
        message: "Owner details not found",
      });
    }

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    console.log(thumbnailImage);

    // Create the seat associated with the library
    const seat = await Seat.create({
      seatnumber: null,
      row: null,
      libraryid: null,
      column: null,
      isBooked: null,
      isAvailable: null,
      bookedAt: null,
      bookingDuration: null,
      bookedBy: null,
    });
     // Create the price entry (you can modify this according to your price input requirements)
    const price = await Price.create({
       // This will be updated later
      price: {
        libraryId :null,
        oneHour: 10, // Set default values or get from request body
        twoHours: 20,
        oneDay: 30,
        twoDays: 50,
        oneWeek: 60,
        oneMonth: 70,
      }
    });

    // Create the library
    const library = await Library.create({
      owner_Id: ownerId,
      library_name,
      pin,
      city,
      address,
      location,
      thumbnail: thumbnailImage.secure_url,
      about,
      otherLibraryData: seat._id,
      
      priceAccordingToDuration : price._id,
    });


    

    return res.status(200).json({
      success: true,
      library,
      ownerDetails,
      message: "Library registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};


// ==============================================
// ===                                      ====
// ==          view librray data            ====
// ==                                       ====
// ============================================= 


exports.viewlibrary = async (req, res) => {
  try {

     // Get user ID from request object
     const ownerId = req.user.id;

    
    // get library Data
    const libraryData = await Library.findOne({ owner_Id: ownerId })
     .populate("otherLibraryData").populate("priceAccordingToDuration")
        .exec()


        

        return res.status(200).json({
          success: true,
          data: libraryData,
        })
    
  } catch (error) {
    console.error(error)
    
  }
}


// ==============================================
// ===                                      ====
// ==          Nearsrs Library  find           ====
// ==                                       ====
// ============================================= 


exports.nearestlibrary = async (req, res) => {

  try {
    // coordinates: [longitude, latitude] getting cordinates from body
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
   
   
    

    if ( !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    // Perform the geospatial query
    
    const libraries  = await Library.aggregate([
      {
        $geoNear : {
            near : {type : "Point",coordinates : [latitude,longitude]},
            key : "location",
            maxDistance : parseInt(2)*1609, // 1 mile radius
            distanceField : "dist.calculated",
            spherical : true
        }
      }
    ])

    // check if their is no library near me

    if (libraries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No libraries found near your location",
      });
    }

    // Convert the calculated distance from meters to kilometers
    const librariesWithDistanceInKm = libraries.map((library) => {
      return {
        ...library,
        dist: {
          calculated: (library.dist.calculated / 1000).toFixed(2), // convert to km and round to 2 decimal places
        },
      };
    });

    res.status(200).send({
      success : true,
      msg: "nerest library is..",
      data :librariesWithDistanceInKm 
    })
    
  } catch (error) {
    console.error(error)
    
  }

}


// ==============================================
// ===                                      ====
// ==          regiter seats (add setas)           ====
// ==                                       ====
// ============================================= 


exports.addSeats = async (req,res) => {

  try {

     // Get user ID from request object
     const ownerId = req.user.id;
   

    //get rows and columns from the bovdy

    const {  rows, columns } = req.body;

    // Validate request body
    if (rows === undefined || columns === undefined) {
      return res.status(400).json({
        success: false,
        message: "Rows and columns are required",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    // Find the library owned by the user
    const library = await Library.findOne({ owner_Id: ownerId });
    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library not found",
      });
    }

     const libraryId = library._id;
    

    const seats = [];

    // Loop to create seats for the library
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // Convert row index to letter (A, B, C, ...)
      for (let col = 1; col <= columns; col++) {
        const seat = await Seat.create({
          seatnumber: `${rowLetter}${col}`,
          row: rowLetter,
          column: col,
          libraryid: libraryId,
          isAvailable: true,
          isBooked: false,
        });

        seats.push(seat);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Seats registered successfully",
      seats,
    });

    
  } catch (error) {
    console.error(error)
    
  }
}



// ==============================================
// ===                                      ====
// ==          display seats to user        ====
// ==                                       ====
// ============================================= 



exports.dispalaySeats = async (req,res) => {
  try {
    // Get the library ID from the request body
    const { libraryId } = req.body;

    // Validate if libraryId is provided
    if (!libraryId) {
      return res.status(400).json({
        success: false,
        message: "Library ID is required",
      });
    }

    // Find the seats associated with the library ID
    const seats = await Seat.find({ libraryid: libraryId });

    if (seats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No seats found for the given library",
      });
    }

    // Return the seats data to the user
    return res.status(200).json({
      success: true,
      seats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to display seats, please try again later",
    });
  }
};

// ==============================================
// ===                                      ====
// ==          Add price by owner           ====
// ==                                       ====
// =============================================

exports.addPrice = async (req, res) => {
  try {
    // Get the owner's ID from the request
    const ownerId = req.user.id;

    // Get the required fields from the request body
    const { libraryId, oneHour, twoHours, oneDay, twoDays, oneWeek, oneMonth } = req.body;

    // Validate request body
    if (!libraryId || oneHour === undefined || twoHours === undefined || oneDay === undefined || twoDays === undefined || oneWeek === undefined || oneMonth === undefined) {
      return res.status(400).json({
        success: false,
        message: "All price fields and library ID are required",
      });
    }

    // Find the library owned by the user
    const library = await Library.findOne({ _id: libraryId, owner_Id: ownerId });
    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library not found or you are not the owner",
      });
    }

    // Check if the price for this library already exists
    const existingPrice = await Price.findOne({ libraryId });
    if (existingPrice) {
      return res.status(400).json({
        success: false,
        message: "Prices for this library have already been added",
      });
    }

    // Create a new price record for the library
    const price = await Price.create({
      libraryId,
      price: {
        oneHour,
        twoHours,
        oneDay,
        twoDays,
        oneWeek,
        oneMonth,
      }
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Prices added successfully",
      price,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add prices, please try again later",
    });
  }
};
