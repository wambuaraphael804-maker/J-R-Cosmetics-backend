# J-R Cosmetics Backend API

A complete Express.js backend for an e-commerce cosmetics platform with user authentication, product management, shopping cart, orders, and payment integration.

## 🚀 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Product Management (CRUD operations)
- ✅ Shopping Cart Management
- ✅ Order Management
- ✅ Payment Integration Ready (Mpesa, Stripe, etc.)
- ✅ Error Handling & Validation
- ✅ CORS enabled for frontend integration
- ✅ MongoDB Database with Mongoose ODM

## 📁 Project Structure

```
├── config/
│   └── db.js                 # Database connection
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── Cart.js              # Cart schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── productController.js # Product logic
│   ├── orderController.js   # Order logic
│   ├── cartController.js    # Cart logic
│   └── paymentController.js # Payment logic
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── products.js          # Product endpoints
│   ├── cart.js              # Cart endpoints
│   ├── orders.js            # Order endpoints
│   └── payment.js           # Payment endpoints
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── errorHandler.js      # Error handling
│   └── validation.js        # Input validation
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json             # Dependencies
```

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/J-R-Cosmetics-backend.git
   cd J-R-Cosmetics-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env` file with configuration:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jr-cosmetics?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   PAYMENT_PROVIDER=mpesa
   MPESA_ENV=sandbox
   MPESA_CONSUMER_KEY=your_mpesa_key_here
   MPESA_CONSUMER_SECRET=your_mpesa_secret_here
   MPESA_SHORTCODE=your_shortcode_here
   MPESA_PASSKEY=your_passkey_here
   MPESA_CALLBACK_URL=http://localhost:5000/api/payment/callback
   NGROK_URL=
   FRONTEND_URL=http://localhost:3000
   ```

   - For local development, you can also use a local MongoDB URI:
     `MONGODB_URI=mongodb://127.0.0.1:27017/jr-cosmetics`
   - For Render deployment, set `MONGODB_URI` in the Render environment variables dashboard.

4. Start the server
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/update` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=skincare` - Filter by category
- `GET /api/products?search=moisturizer` - Search products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Shopping Cart (Protected)
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status (Admin)

### Payment (Protected)
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/callback` - Payment webhook
- `GET /api/payment/verify/:orderId` - Verify payment

## 🔐 Authentication

Include JWT token in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product
```bash
POST /api/products
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Facial Moisturizer",
  "description": "Hydrating moisturizer for all skin types",
  "price": 2500,
  "category": "skincare",
  "image": "url_to_image",
  "stock": 100
}
```

### Add to Cart
```bash
POST /api/cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "60d5ec49c1234567890abcd1",
  "quantity": 2
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "60d5ec49c1234567890abcd1",
      "name": "Facial Moisturizer",
      "price": 2500,
      "quantity": 2
    }
  ],
  "totalAmount": 5000,
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Nairobi",
    "country": "Kenya"
  },
  "phone": "+254712345678"
}
```

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  country: String,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (enum),
  image: String,
  stock: Number,
  rating: Number,
  reviews: Array,
  createdAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: Array,
  totalAmount: Number,
  status: String (enum),
  paymentMethod: String,
  transactionId: String,
  shippingAddress: Object,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId,
  items: Array,
  totalPrice: Number,
  updatedAt: Date
}
```

## 🚀 Deployment

### Deploy to Render.com
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
```

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Error handling
- Protected routes

## 🐛 Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message here"
}
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **axios** - HTTP client

## 📄 License

MIT

## 👨‍💻 Support

For issues and questions, please open an issue on GitHub.
