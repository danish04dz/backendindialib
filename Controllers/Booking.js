const Booking = require("../models/Booking");
const User = require("../models/User");
const Library = require("../models/Library");
const Seat = require("../models/Seat");
const Price = require("../models/Price");

// Utility to calculate booking end time based on duration
const calculateEndTime = (startTime, duration) => {
  let durationInMinutes = 0;

  // Convert the duration to minutes based on the provided booking duration
  switch (duration) {
    case "1 hour":
      durationInMinutes = 60;
      break;
    case "2 hours":
      durationInMinutes = 120;
      break;
    case "5 hours":
      durationInMinutes = 300;
      break;
    case "1 day":
      durationInMinutes = 24 * 60;
      break;
    case "2 days":
      durationInMinutes = 2 * 24 * 60;
      break;
    case "1 week":
      durationInMinutes = 7 * 24 * 60;
      break;
    case "1 month":
      durationInMinutes = 30 * 24 * 60;
      break;
    default:
      throw new Error("Invalid booking duration");
  }

  // Calculate the end time by adding the duration to the start time
  return new Date(startTime.getTime() + durationInMinutes * 60000); // Convert minutes to milliseconds
};

// ==============================================
// ===                                      ====
// ==          Create a Booking             ====
// ==                                       ====
// ==============================================

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const { seatId, bookingDuration, startTime, amountPaid } = req.body;

    // Validate input
    if (!seatId || !bookingDuration || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Seat ID, booking duration, and start time are required.",
      });
    }

    // Validate booking duration
    const validDurations = ["1 hour", "2 hours", "5 hours", "1 day", "2 days", "1 week", "1 month"];
    if (!validDurations.includes(bookingDuration)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking duration.",
      });
    }

    // Find the seat
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found.",
      });
    }

    // Check if the seat is available
    if (!seat.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Seat is currently not available.",
      });
    }

    // Find the library associated with the seat
    const library = await Library.findById(seat.libraryid);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library associated with the seat not found.",
      });
    }

    // Calculate the end time based on the start time and booking duration
    const endTime = calculateEndTime(new Date(startTime), bookingDuration);

    // Create the booking
    const booking = await Booking.create({
      user: userId,
      seat: seatId,
      library: library._id,
      startTime: new Date(startTime),  // Ensure the startTime is a valid Date object
      endTime,
      bookingDuration,
      amountPaid: amountPaid || 0, // Default to 0 if not provided
      paymentStatus: amountPaid > 0 ? "Paid" : "Pending",
      bookingDate: new Date() // Record the booking creation date
    });

    // Update seat availability
    seat.isAvailable = false;
    seat.isBooked = true;
    seat.bookedAt = new Date(); // Set the current date as booked date
    seat.bookingDuration = bookingDuration;
    seat.bookedBy = userId;
    await seat.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully. Waiting for payment confirmation.",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create booking, please try again later.",
    });
  }
};




// ==============================================
// ===                                      ====
// ==          manage boking by owner       ====
// ==                                       ====
// ==============================================


exports.manageBookingByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id; // Assuming user is authenticated as the owner
    const { bookingId, newStatus } = req.body;

    // Validate input
    if (!bookingId || !newStatus) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and new status are required.",
      });
    }

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Find the library associated with the seat
    const seat = await Seat.findById(booking.seat);
    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found.",
      });
    }

    const library = await Library.findById(seat.libraryid);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library not found.",
      });
    }

    // Check if the current user is the owner of the library
    if (library.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this booking.",
      });
    }

    // Update the booking status (e.g., "Completed", "Canceled")
    const validStatuses = ["Pending", "Completed", "Canceled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    // If status is "Completed" or "Canceled", update seat availability
    if (newStatus === "Completed" || newStatus === "Canceled") {
      seat.isAvailable = true;
      seat.isBooked = false;
      seat.bookedBy = null;
      seat.bookedAt = null;
      seat.bookingDuration = null;
      await seat.save();
    }

    // Update the booking status
    booking.status = newStatus;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${newStatus} successfully.`,
      booking,
    });
  } catch (error) {
    console.error("Error managing booking:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to manage booking, please try again later.",
    });
  }
};


// ==============================================
// ===                                      ====
// ==   Get All Bookings by Library Owner    ====
// ==                                       ====
// ==============================================

exports.getBookingsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id; // Assuming user is authenticated as the owner

    // Find all libraries owned by the current owner
    const libraries = await Library.find({ owner_Id: ownerId });
    if (libraries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No libraries found for this owner.",
      });
    }

    // Extract library IDs
    const libraryIds = libraries.map(library => library._id);

    // Find all bookings for these libraries
    const bookings = await Booking.find({ library: { $in: libraryIds } })
      .populate('user', 'name email') // Populate user details if needed
      .populate('seat'); // Populate seat details if needed

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings by owner:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings, please try again later.",
    });
  }
};

// ==============================================
// ===                                      ====
// ==       Get All Bookings by User          ====
// ==                                       ====
// ==============================================

exports.getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated

    // Find all bookings for the current user
    const bookings = await Booking.find({ user: userId })
      .populate('library', 'library_name address') // Populate library details if needed
      .populate('seat'); // Populate seat details if needed

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings by user:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings, please try again later.",
    });
  }
};

