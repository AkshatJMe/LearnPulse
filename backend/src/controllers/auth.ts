import { Request, Response } from "express"; // Importing Request and Response types from Express framework for handling HTTP requests and responses
import bcrypt from "bcrypt"; // Importing bcrypt for hashing passwords
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for generating JWT tokens
import { User } from "../models/user.js"; // Importing User model from "../models/user.js" to interact with user data in the database
import { generateOTP } from "../utils/otpGenerator.js"; // Importing generateOTP function from "../utils/otpGenerator.js" for generating OTPs
import { mailSender } from "../utils/mailSender.js"; // Importing mailSender function from "../utils/mailSender.js" for sending emails
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js"; // Importing otpTemplate function from "../mail/templates/emailVerificationTemplate.js" for generating OTP email templates
import { OTP } from "../models/OTP.js"; // Importing OTP model from "../models/OTP.js" to interact with OTP data in the database
import { Profile } from "../models/profile.js"; // Importing Profile model from "../models/profile.js" to interact with user profile data in the database
import { NewUserSignupBody } from "../types/auth/NewUserSignupBody.js"; // Importing NewUserSignupBody type from "../types/auth/NewUserSignupBody.js" for defining the structure of request body in user signup
import { Logintyps } from "../types/auth/LoginTyps.js"; // Importing Logintyps type from "../types/auth/LoginTyps.js" for defining the structure of request body in user login
import { ChangePasswordTypes } from "../types/auth/ChangePasswordTypes.js"; // Importing ChangePasswordTypes type from "../types/auth/ChangePasswordTypes.js" for defining the structure of request body in changing password
import { passwordUpdated } from "../mail/templates/passwordUpdate.js"; // Importing passwordUpdated function from "../mail/templates/passwordUpdate.js" for generating password update email templates

// Send OTP for user registration
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Extract name from email for OTP template
    const name = email
      .split("@")[0]
      .split(".") //@ts-ignore
      .map((part) => part.replace(/\d+/g, ""))
      .join(" ");

    // Save OTP to database
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    console.log(`🔐 OTP generated for ${email}: ${otp}`);

    // Send OTP verification email
    try {
      await mailSender(email, "OTP Verification Email", otpTemplate(otp, name));
      console.log(`✅ OTP email sent successfully to ${email}`);
    } catch (emailError: any) {
      console.error(`❌ Failed to send OTP email to ${email}:`, emailError.message);
      // Continue even if email fails - OTP is saved in DB and returned in response
      console.log(`⚠️ Email failed but OTP is saved. OTP: ${otp}`);
    }

    // Respond with success message and OTP (for testing purposes)
    res.status(200).json({
      success: true,
      otp,
      message: "OTP generated successfully. Check your email or use the OTP from response (dev mode).",
    });
  } catch (error: any) {
    // Handle any errors
    console.error("❌ Error in sendOTP controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error while generating OTP",
    });
  }
};

// User signup endpoint
export const signup = async (
  req: Request<{}, {}, NewUserSignupBody>,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Retrieve OTP from database for email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    // Verify OTP
    if (response.length === 0 || otp !== response[0].otp) {
      // OTP not found or invalid
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user approval status based on account type (example logic)
    let approved: string | boolean = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // Create a profile for the user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // Create the user in the database

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // Respond with success message and user details
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again...",
    });
  }
};

// User login endpoint
export const login = async (req: Request<{}, {}, Logintyps>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user by email and populate additional details
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Compare hashed password
    if (await bcrypt.compare(password, user.password)) {
      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET!, // JWT secret key from environment variable
        {
          expiresIn: "24h", // Token expires in 24 hours
        }
      );

      // Update user's token and hide password for security reasons
      user.token = token;
      user.password = "Hidden Because of Obvious Reasons"; // Not sending password in response

      // Configure options for HTTP cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expires in 3 days
        httpOnly: true, // Cookie is accessible only through HTTP(S) protocol
      };

      // Set token as a cookie and send success response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      // Password does not match
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    // Handle any errors during login process
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

// Change password endpoint
export const changePassword = async (
  req: Request<{}, {}, ChangePasswordTypes>,
  res: Response
) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user details by ID (assuming req.user.id is available from middleware)
    //@ts-ignore
    const userDetails = await User.findById(req.user?.id);

    // Compare old password with hashed password from database
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails!.password ?? ""
    );

    // If old password does not match, return error
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "The password and confirm password do not match",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    const updatedUserDetails = await User.findByIdAndUpdate(
      //@ts-ignore
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );

    // Send email notification about password update
    try {
      await mailSender(
        updatedUserDetails!.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails!.email,
          `Password updated successfully for ${updatedUserDetails!.firstName} ${
            updatedUserDetails!.lastName
          }`
        )
      );
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    // Handle any errors during password change process
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
    });
  }
};
