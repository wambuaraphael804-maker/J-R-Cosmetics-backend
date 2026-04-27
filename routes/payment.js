const express = require("express");
const {
  initiatePayment,
  paymentCallback,
  verifyPayment,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/initiate", authMiddleware, initiatePayment);
router.post("/callback", paymentCallback); // Webhook - no auth needed
router.get("/verify/:orderId", authMiddleware, verifyPayment);

module.exports = router;
