import express from "express"; // Importing express to create an Express application

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
import coupon from "./routes/coupon.js"; //Handle the coupon by the admin
import paymentRoutes from "./routes/payments.js"; //Routes for handling the payment

// Load environment variables from the .env file
config({
  path: "./.env", // Path to the .env file that contains environment variables
});

// Retrieve environment variables
const port = process.env.PORT!; // The port on which the server will run
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
app.use("/api/v1/coupon", coupon); //Routes for the coupon adding, discount, apply etc.
app.use("/api/v1/payment", paymentRoutes); //Route for handling the payment

// Default route to test server functionality
app.get("/", (req, res) => {
  res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`); // Log message indicating that the server is running
});
