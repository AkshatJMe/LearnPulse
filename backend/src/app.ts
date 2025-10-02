import express from "express"; // Importing express to create an Express application
import type { Request, Response } from "express";

import { config } from "dotenv"; // Importing dotenv to load environment variables from a .env file
import cookieParser from "cookie-parser"; // Importing cookie-parser to parse cookies in incoming requests
import fileUpload from "express-fileupload"; // Importing express-fileupload to handle file uploads

import cors from "cors"; // Importing cors to enable Cross-Origin Resource Sharing (CORS)
import { connectDB } from "./config/database.js"; // Importing the function to connect to the MongoDB database
import { cloudinaryConnect } from "./config/cloudinary.js"; // Importing the function to connect to Cloudinary

// Importing route handlers for different parts of the application
import userRoutes from "./routes/user.js"; // Routes for user authentication and management
import courseRoutes from "./routes/course.js"; // Routes for course-related operations
import profileRoutes from "./routes/profile.js"; // Routes for user profile operations
import coupon from "./routes/coupon.js"; // Handle the coupon by the admin
import paymentRoutes from "./routes/payments.js"; // Routes for handling the payment
import stripePaymentRoutes from "./routes/stripePayment.js"; // Routes for Stripe payment
import cartRoutes from "./routes/cart.js"; // Routes for cart management
import wishlistRoutes from "./routes/wishlist.js"; // Routes for wishlist management
import quizRoutes from "./routes/quiz.js"; // Routes for quiz system
import discussionRoutes from "./routes/discussion.js"; // Routes for discussion system
import certificateRoutes from "./routes/certificate.js"; // Routes for certificates
import adminRoutes from "./routes/admin.js"; // Routes for admin panel
import analyticsRoutes from "./routes/analytics.js"; // Routes for analytics

// Load environment variables from the .env file
config({
  path: "./.env", // Path to the .env file that contains environment variables
});

// Retrieve environment variables
const port = Number(process.env.PORT || 4000); // The port on which the server will run
const url = process.env.DATABASE_URL!; // The URL for connecting to the MongoDB database
const cloud_name = process.env.CLOUD_NAME!; // The Cloudinary cloud name
const key = process.env.API_KEY!; // The Cloudinary API key
const secret = process.env.API_SECRET!; // The Cloudinary API secret

// Create an Express application
const app = express();

// Connect to the MongoDB database using the provided URL
connectDB(url);

// Connect to Cloudinary using the specified credentials
cloudinaryConnect(cloud_name, key, secret);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to handle CORS (Cross-Origin Resource Sharing)
// This configuration allows requests from any origin and supports credentials (useful for development)
app.use(
  cors({
    // origin: 'http://localhost:5173', // Uncomment and specify frontend link for production use
    origin: "*", // Allow requests from any origin
    credentials: true, // Allow credentials (e.g., cookies) to be included in requests
  })
);

app.use(express.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files for uploads
    tempFileDir: "/tmp", // Directory to store temporary files
  })
);

// Define API routes for different functionalities
app.use("/api/v1/auth", userRoutes); // Routes for user authentication (e.g., login, registration)
app.use("/api/v1/profile", profileRoutes); // Routes for managing user profiles (e.g., view and update profile)
app.use("/api/v1/course", courseRoutes); // Routes for managing courses (e.g., create, update, delete courses)
app.use("/api/v1/coupon", coupon); // Routes for the coupon adding, discount, apply etc.
app.use("/api/v1/payment", paymentRoutes); // Route for handling the payment (legacy Razorpay)
app.use("/api/v1/stripe", stripePaymentRoutes); // Routes for Stripe payment
app.use("/api/v1/cart", cartRoutes); // Routes for cart management
app.use("/api/v1/wishlist", wishlistRoutes); // Routes for wishlist management
app.use("/api/v1/quiz", quizRoutes); // Routes for quiz system
app.use("/api/v1/discussion", discussionRoutes); // Routes for discussion system
app.use("/api/v1/certificate", certificateRoutes); // Routes for certificates
app.use("/api/v1/admin", adminRoutes); // Routes for admin panel
app.use("/api/v1/analytics", analyticsRoutes); // Routes for analytics

// Default route to test server functionality
app.get("/", (req: Request, res: Response) => {
  res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});

// Start the server and listen on the specified port
const startServer = (preferredPort: number) => {
  const server = app.listen(preferredPort, () => {
    console.log(`Express is working on http://localhost:${preferredPort}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = preferredPort + 1;
      console.warn(
        `Port ${preferredPort} is already in use. Retrying on http://localhost:${fallbackPort}`
      );
      startServer(fallbackPort);
      return;
    }

    throw error;
  });
};

startServer(port);
