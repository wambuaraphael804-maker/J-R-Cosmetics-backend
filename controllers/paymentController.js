const Order = require("../models/Order");
const axios = require("axios");

const getMpesaBaseUrl = () => {
  if (process.env.MPESA_ENV === "production") {
    return "https://api.safaricom.co.ke";
  }
  return "https://sandbox.safaricom.co.ke";
};

const getTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  const second = `${now.getSeconds()}`.padStart(2, "0");
  return `${year}${month}${day}${hour}${minute}${second}`;
};

const getAccessToken = async () => {
  const baseUrl = getMpesaBaseUrl();
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const url = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

const buildPassword = (shortcode, passkey, timestamp) => {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
};

const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("7")) {
    return `254${digits}`;
  }
  if (digits.length === 10 && digits.startsWith("07")) {
    return `254${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("254")) {
    return digits;
  }
  return digits;
};

const getCallbackUrl = () => {
  if (process.env.MPESA_CALLBACK_URL) {
    return process.env.MPESA_CALLBACK_URL;
  }
  if (process.env.NGROK_URL) {
    return `${process.env.NGROK_URL.replace(/\/$/, "")}/api/payment/callback`;
  }
  return `http://localhost:${process.env.PORT || 5000}/api/payment/callback`;
};

// @route   POST /api/payment/initiate
// @desc    Initiate payment (Mpesa STK push)
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({ error: "Order ID and phone required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const amount = order.totalAmount;
    const phoneNumber = normalizePhone(phone);
    const timestamp = getTimestamp();
    const password = buildPassword(process.env.MPESA_SHORTCODE, process.env.MPESA_PASSKEY, timestamp);
    const accessToken = await getAccessToken();
    const url = `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`;

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: getCallbackUrl(),
      AccountReference: order._id.toString(),
      TransactionDesc: `Payment for order ${order._id}`,
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const responseBody = response.data || {};
    order.paymentMethod = "mpesa";
    order.checkoutRequestId = responseBody.CheckoutRequestID || responseBody.checkoutRequestID;
    order.merchantRequestId = responseBody.MerchantRequestID || responseBody.merchantRequestID;
    await order.save();

    res.json({
      success: true,
      message: "Mpesa STK Push initiated",
      orderId: order._id,
      checkoutRequestId: order.checkoutRequestId,
      merchantRequestId: order.merchantRequestId,
      mpesaResponse: responseBody,
    });
  } catch (error) {
    console.error("Mpesa initiate payment error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to initiate Mpesa payment",
      details: error.response?.data || error.message,
    });
  }
};

// @route   POST /api/payment/callback
// @desc    Payment callback from provider
exports.paymentCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback || req.body?.Body || req.body;
    if (!callback) {
      return res.status(400).json({ error: "Invalid Mpesa callback payload" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    const order = await Order.findOne({
      $or: [
        { checkoutRequestId: CheckoutRequestID },
        { merchantRequestId: MerchantRequestID },
      ],
    });

    if (!order) {
      console.warn("Mpesa callback received for unknown order:", { MerchantRequestID, CheckoutRequestID });
      return res.status(404).json({ error: "Order not found for Mpesa callback" });
    }

    const updates = {
      merchantRequestId: MerchantRequestID,
      checkoutRequestId: CheckoutRequestID,
      updatedAt: Date.now(),
    };

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const receiptItem = items.find((item) => item.Name === "MpesaReceiptNumber");
      const amountItem = items.find((item) => item.Name === "Amount");
      const phoneItem = items.find((item) => item.Name === "PhoneNumber");

      updates.status = "paid";
      updates.transactionId = receiptItem?.Value || CheckoutRequestID;
      updates.receiptNumber = receiptItem?.Value;
      updates.paymentPhone = phoneItem?.Value;
      updates.paymentDate = new Date();
      updates.totalAmount = amountItem?.Value || order.totalAmount;
    } else {
      updates.status = "cancelled";
    }

    const updatedOrder = await Order.findByIdAndUpdate(order._id, updates, { new: true });

    return res.json({
      success: true,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Mpesa callback processing error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/payment/verify/:orderId
// @desc    Verify payment status
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id  // ✅ Security fix
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      isPaid: order.status === "paid",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};