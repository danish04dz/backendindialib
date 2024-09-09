const express = require("express");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require('dotenv').config();
require('./utils/expiredBookings');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse cookies
app.use(cookieParser());

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",  // For local development
  "https://indialib.netlify.app"  // Netlify production frontend
];

// CORS options to handle allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Enable cookies and other credentials
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Middleware for file uploads using Cloudinary
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Connecting to Cloudinary
cloudinaryConnect();

// Simple route to test if the server is running
app.get("/", (req, res) => {
  res.send("Testing production API");
});

// Import and mount routes
const user = require("./routes/user");
app.use("/api/v1", user);


// Import and mount routes
const findlibrary = require("./routes/findlibrary");
app.use("/api/v1/find", findlibrary);

const profileRoutes = require("./routes/profile");
app.use("/api/v1/profile", profileRoutes);

const libraryRoutes = require("./routes/library");
app.use("/api/v1/", libraryRoutes);

const bookings = require("./routes/booking");
app.use("/api/v1/bookings", bookings);

// Connect to the database
require("./config/database").connect();

// Activate server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
