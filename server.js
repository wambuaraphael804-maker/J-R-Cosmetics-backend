require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ VERY IMPORTANT for Render
const PORT = process.env.PORT || 5000;

// ==========================
// TEST ROOT ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ==========================
// SIMPLE PAY TEST ROUTE
// ==========================
// (we'll confirm this works first)
app.post("/pay", (req, res) => {
  res.json({ message: "Pay route is working" });
});

// ==========================
// CALLBACK ROUTE
// ==========================
app.post("/callback", (req, res) => {
  console.log("Callback:", req.body);
  res.sendStatus(200);
});

// ==========================
// START SERVER
// ==========================
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});