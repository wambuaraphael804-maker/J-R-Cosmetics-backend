const express = require("express");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:productId", updateCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
