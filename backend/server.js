import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

const app = express();

// STEP 1: ALLOWED FRONTEND URLS
const allowedOrigins = [
  "http://localhost:5173",
  "https://cloud-kitchen-2-mpln.onrender.com"
];

// STEP 2: CORS CONFIGURATION
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// STEP 3: MIDDLEWARE
app.use(express.json());

// STEP 4: HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FC Kitchen API is running!"
  });
});

// STEP 5: HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

// STEP 6: API ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/testimonials", testimonialRoutes);

// STEP 7: SERVER PORT
const PORT = process.env.PORT || 5000;

// STEP 8: CONNECT DATABASE AND START SERVER
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FC Kitchen Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();