import { NextFunction, Request, Response } from "express"; // Importing types for Express middleware functions and HTTP requests/responses
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for working with JSON Web Tokens (JWT)
import { DecodedTokenTypes } from "../types/middleware/DecodedTokenTypes.js"; // Importing type definition for decoded JWT tokens

// Middleware function to handle authentication by verifying JWT
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Attempt to extract the JWT token from different parts of the request
    const token =
      req.body?.token || // Token in the request body
      req.cookies.token || // Token in the request cookies
      req.header("Authorization")?.replace("Bearer ", ""); // Token in the Authorization header (formatted as Bearer token)

    // If no token is provided, respond with a 401 Unauthorized status
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is Missing", // Corrected typo from "messgae" to "message"
      });
    }

    try {
      // Verify and decode the token using the JWT secret key from environment variables
      const decode = jwt.verify(
        token,
        process.env.JWT_SECRET! // JWT secret must be provided in environment variables
      ) as DecodedTokenTypes; // Cast the decoded token to DecodedTokenTypes for type safety
      //@ts-ignore
      req.user = decode; // Attach decoded user information to the request object for use in subsequent middleware or route handlers
    } catch (error) {
      // If there is an error verifying or decoding the token, respond with a 401 Unauthorized status
      return res.status(401).json({
        success: false,
        message: "Error while decoding token", // Corrected typo from "messgae" to "message"
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle any general errors that occur during the authentication process
    return res.status(500).json({
      success: false,
      message: "Error while token validating", // Corrected typo from "messgae" to "message"
    });
  }
};

// Middleware function to restrict access to routes for users with 'student' account type
export const isStudent = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the user's account type is 'student' (case-insensitive)
    //@ts-ignore
    if (req.user?.accountType?.toLowerCase() !== "student") {
      return res.status(401).json({
        success: false,
        message: "This Page is protected only for student", // Corrected typo from "messgae" to "message"
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle any general errors during validation
    return res.status(500).json({
      success: false,
      message: "Error while checking user validity with student accountType", // Corrected typo from "cheching" to "checking"
    });
  }
};

// Middleware function to restrict access to routes for users with 'instructor' account type
export const isInstructor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the user's account type is 'instructor' (case-insensitive)
    //@ts-ignore
    if (req.user?.accountType?.toLowerCase() !== "instructor") {
      return res.status(401).json({
        success: false,
        message: "This Page is protected only for Instructor", // Corrected typo from "messgae" to "message"
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Log the error and handle any general errors during validation
    console.log(
      "Error while checking user validity with Instructor accountType" // Corrected typo from "cheching" to "checking"
    );
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while checking user validity with Instructor accountType", // Corrected typo from "cheching" to "checking"
    });
  }
};

// Middleware function to restrict access to routes for users with 'admin' account type
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the user's account type is 'admin' (case-insensitive)
    //@ts-ignore
    if (req.user?.accountType?.toLowerCase() !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This Page is protected only for Admin", // Corrected typo from "messgae" to "message"
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle any general errors during validation
    return res.status(500).json({
      success: false,
      message: "Error while checking user validity with Admin accountType", // Corrected typo from "cheching" to "checking"
    });
  }
};
