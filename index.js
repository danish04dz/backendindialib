const express = require("express");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

require('./utils/expiredBookings');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",  // Local development
  "https://indialib.netlify.app/",  // Production frontend
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or if no origin (for non-browser clients)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "PUT"],
  credentials: true,
};

// Use CORS middleware with the updated options
app.use(cors(corsOptions));
app.use(express.json());

require("./config/database").connect();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to Cloudinary
cloudinaryConnect();

// Import and mount routes
const user = require("./routes/user");
app.use("/api/v1", user);

const profileRoutes = require("./routes/profile");
app.use("/api/v1/profile", profileRoutes);

const libraryRoutes = require("./routes/library");
app.use("/api/v1/", libraryRoutes);

const bookings = require("./routes/booking");
app.use("/api/v1/bookings", bookings);

// Activate server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
