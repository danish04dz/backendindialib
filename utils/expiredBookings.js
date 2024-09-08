const cron = require('node-cron');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

// Utility function to mark expired bookings
const markExpiredBookings = async () => {
  try {
    // Find all bookings where the end time is in the past and the status is not 'Completed'
    const now = new Date();
    const expiredBookings = await Booking.find({
      endTime: { $lt: now },
      status: { $ne: 'Completed' }
    });

    // Process each expired booking
    for (const booking of expiredBookings) {
      // Update the seat to be available
      const seat = await Seat.findById(booking.seat);
      if (seat) {
        seat.isAvailable = true;
        seat.isBooked = false;
        seat.bookedBy = null;
        seat.bookedAt = null;
        seat.bookingDuration = null;
        await seat.save();
      }

      // Update the booking status to 'Completed'
      booking.status = 'Completed';
      await booking.save();
    }

    console.log('Expired bookings processed successfully.');
  } catch (error) {
    console.error('Error processing expired bookings:', error);
  }
};

// Schedule the job to run every minute
cron.schedule('* * * * *', markExpiredBookings);
