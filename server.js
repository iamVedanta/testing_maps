const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000; // Use environment variable or default to 3000

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema and Model
const coordinateSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coordinate = mongoose.model("Coordinate", coordinateSchema);

// API Endpoint
app.post("/api/save", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude must be numbers" });
  }

  try {
    const newCoordinate = new Coordinate({ latitude, longitude });
    await newCoordinate.save();
    res
      .status(201)
      .json({ message: "Location saved successfully", data: newCoordinate });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Start Server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
