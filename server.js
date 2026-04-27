require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

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

app.post("/pay", async (req,res)=>{
  try{
    const { phone, amount } = req.body;

    const token = await getAccessToken();

    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g,"").slice(0,14);
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
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);

  }catch(err){
    console.log(err);
    res.status(500).send("Error");
  }
});

app.listen(PORT, ()=>console.log("Server running on 5000"));