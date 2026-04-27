/**
 * TEST ENDPOINTS
 * Copy and paste these URLs in your browser or use Postman/Insomnia
 */

// ==================== PUBLIC ENDPOINTS ====================

// 1. Health Check
GET http://localhost:5000/health

// 2. Get All Products
GET http://localhost:5000/api/products

// 3. Search Products
GET http://localhost:5000/api/products?category=skincare
GET http://localhost:5000/api/products?search=moisturizer

// 4. Get Single Product (replace ID)
GET http://localhost:5000/api/products/{product_id}


// ==================== AUTHENTICATION ====================

// 5. Register New User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Cosmetics",
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response will include a JWT token

// 6. Login User
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

// Use the returned token in Authorization header for protected routes


// ==================== PROTECTED ENDPOINTS ====================
// Add this header to all protected requests:
// Authorization: Bearer YOUR_JWT_TOKEN_HERE


// 7. Get User Profile (PROTECTED)
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN

// 8. Update User Profile (PROTECTED)
PUT http://localhost:5000/api/auth/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+254712345678",
  "address": "123 Main Street",
  "city": "Nairobi",
  "country": "Kenya"
}


// ==================== SHOPPING CART (PROTECTED) ====================

// 9. Get Cart
GET http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN

// 10. Add Product to Cart
POST http://localhost:5000/api/cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID_FROM_GET_REQUEST",
  "quantity": 2
}

// 11. Update Item Quantity in Cart
PUT http://localhost:5000/api/cart/update/{product_id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "quantity": 5
}

// 12. Remove Item from Cart
DELETE http://localhost:5000/api/cart/remove/{product_id}
Authorization: Bearer YOUR_TOKEN

// 13. Clear Entire Cart
DELETE http://localhost:5000/api/cart/clear
Authorization: Bearer YOUR_TOKEN


// ==================== ORDERS (PROTECTED) ====================

// 14. Create Order
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "PRODUCT_ID",
      "name": "Hydrating Face Moisturizer",
      "price": 2500,
      "quantity": 2,
      "image": "url_to_image"
    }
  ],
  "totalAmount": 5000,
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Nairobi",
    "country": "Kenya",
    "zipCode": "00100"
  },
  "phone": "+254712345678",
  "notes": "Please deliver by Friday"
}

// 15. Get User Orders
GET http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN

// 16. Get Single Order
GET http://localhost:5000/api/orders/{order_id}
Authorization: Bearer YOUR_TOKEN

// 17. Update Order Status (Admin)
PUT http://localhost:5000/api/orders/{order_id}/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "shipped"
}


// ==================== PAYMENT (PROTECTED) ====================

// 18. Initiate Payment
POST http://localhost:5000/api/payment/initiate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "orderId": "ORDER_ID_FROM_CREATE_ORDER",
  "phone": "+254712345678"
}

// 19. Verify Payment
GET http://localhost:5000/api/payment/verify/{order_id}
Authorization: Bearer YOUR_TOKEN

// 20. Payment Callback (Webhook - no auth needed)
POST http://localhost:5000/api/payment/callback
Content-Type: application/json

{
  "orderId": "ORDER_ID",
  "transactionId": "TXN123456",
  "status": "success",
  "amount": 5000
}


// ==================== ORDER STATUS VALUES ====================
/*
- "pending" - Order placed, awaiting payment
- "paid" - Payment received
- "processing" - Being prepared for shipment
- "shipped" - On the way to customer
- "delivered" - Received by customer
- "cancelled" - Order cancelled
*/


// ==================== PRODUCT CATEGORIES ====================
/*
- skincare
- makeup
- haircare
- bodycare  
- fragrance
*/


// ==================== HOW TO USE ====================
/*
1. Start the server: npm run dev
2. Register/Login to get a token
3. Use the token in Authorization header for protected routes
4. Test each endpoint in Postman or Insomnia
5. Replace placeholders like {product_id}, {order_id}, YOUR_TOKEN with actual values
*/
