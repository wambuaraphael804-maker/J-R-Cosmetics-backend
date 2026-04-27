require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ==========================
// DATABASE CONNECTION
// ==========================
connectDB();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// ROUTES
// ==========================
app.get("/", (req, res) => {
  res.json({
    message: "🎀 J-R Cosmetics Backend API",
    version: "1.0.0",
    status: "running",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "✅ Server is healthy" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ==========================
// ERROR HANDLER MIDDLEWARE
// ==========================
app.use(errorHandler);

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API Documentation:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/products`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register\n`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});