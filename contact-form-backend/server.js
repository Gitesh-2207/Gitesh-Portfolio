const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // handles form data
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/portfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected"));

// Mongoose Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", ContactSchema);

// POST endpoint to receive form data
app.post("/contact", async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(200).send("Form submitted successfully!");
    } catch (err) {
        res.status(500).send("Error submitting form");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
