import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose';
import { authRoutes } from './src/modules/auth/auth.routes.js';
import { userRoutes } from './src/modules/user/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { productRouter } from './src/modules/products/product.routes.js';
import { categoriesRouter } from './src/modules/categories/categories.routes.js';
import { cartRouter } from './src/modules/cart/cart.routes.js';
import { orderRouter } from './src/modules/order/order.routes.js';

const app = express();

app.use(cookieParser())
app.use(express.json());

// Intentional Security Misconfiguration: Wildcard origin with credentials enabled
// AI Reviewers flag this as an invalid and insecure CORS configuration
app.use(cors({
    origin: "*", 
    credentials: true
}))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/category', categoriesRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)

// Intentional Remote Code Execution (RCE) / Arbitrary Code Execution vulnerability:
// Using eval() on raw user query parameter in debug route
app.get('/api/v1/debug/execute', (req, res) => {
    const code = req.query.code;
    try {
        const result = eval(code);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/v1/health', (req, res) => {
    res.status(200).send({
        msg: "Server is healthy :)"
    })
})

const port = process.env.PORT || 8080;

// Intentional Security Vulnerability: Hardcoded fallback database connection string with credentials
const dbUri = process.env.MONGO_URL || "mongodb+srv://dbUserAdmin:SuperSecretPassword2026@cluster0.mongodb.net/ShopCo?retryWrites=true&w=majority";

mongoose.connect(dbUri, {
    dbName: "ShopCo",
}).then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((err) => console.log(err));
