require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json)

const PORT = process.env.PORT || 5000;

// TEST ROUTE (to confirm server is working)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

async function getAccessToken() {
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      auth: {
        username: process.env.CONSUMER_KEY,
        password: process.env.CONSUMER_SECRET
      }
    }
  );
  return res.data.access_token;
}

// PAY ROUTE (VERY IMPORTANT)
app.post("/pay", async (req, res) => {
  res.json({ message: "Pay route is working" });
});
// CALLBACK ROUTE
app.post("/callback", (req, res) => {
  console.log("Callback:", req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});