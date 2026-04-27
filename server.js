require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
  try {
    const { phone, amount } = req.body;

    console.log("Received:", phone, amount);

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      process.env.SHORTCODE +
      process.env.PASSKEY +
      timestamp
    ).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "J&R",
        TransactionDesc: "Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json(err.response?.data || { error: "Payment failed" });
  }
});
// CALLBACK ROUTE
app.post("/callback", (req, res) => {
  console.log("Callback:", req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});