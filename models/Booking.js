const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  library: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "library",
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  bookingDuration: {
    type: String,
    enum: ["1 hour", "2 hours", "5 hours", "1 day", "2 days", "1 week", "1 month"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  startTime: {
    type: Date,  // Store both date and time for the start of the booking
    required: true,
  },
  endTime: {
    type: Date,  // Store both date and time for the end of the booking
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending",
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  cancellationReason: {
    type: String,
    default: null,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });




module.exports = mongoose.model("Booking", bookingSchema);
