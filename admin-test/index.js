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
const corsOptions = {
  origin: [process.env.CORSADMIN, process.env.CORSSTORE],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Required for POST with JSON
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly list methods
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
