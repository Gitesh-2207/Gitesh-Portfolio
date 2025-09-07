require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());

// ✅ CORS Setup (Allow specific origin if provided, otherwise allow all)
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming request from:", origin);

    if (!origin) return callback(null, true); // allow Postman, curl, same-origin

    if (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN) {
      return callback(null, true);
    }

    // Allow local dev (http://localhost:5173, http://127.0.0.1:5500 etc.)
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("CORS policy: origin not allowed"));
  }
};

app.use(cors(corsOptions));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Contact Route (Save Message)
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).send("✅ Message saved to MongoDB!");
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).send("Server error, please try again later.");
  }
});

// ✅ (Optional) Get All Messages
app.get("/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send("❌ Failed to fetch messages.");
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
