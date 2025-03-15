require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./db/connection");
const adminRouter = require("./routes");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Allow specific frontend origin
app.use(
  cors({
    origin: [process.env.CORSADMIN, process.env.CORSSTORE],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    preflightContinue: false,
  })
);

// Handle preflight requests explicitly
app.options("*", cors()); // Allow preflight for all routes
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use("/api/admin", adminRouter);

// Start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 ~ Server running in ${NODE_ENV} mode on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.log("❌ Error", error);
  });
