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

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://fc-kitchen-bds4.onrender.com"
];

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FC Kitchen API is running!"
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
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