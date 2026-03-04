import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";

import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

import { Dispatch } from "redux";
import { SignUpParams } from "../../types/auth/SignUpParams";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";
import { getCart } from "./cartAPI";

export function sendOtp(email: string, navigate: any) {
  // Adjust 'any' to the appropriate type if possible
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector({
        method: "POST",
        url: SENDOTP_API,
        bodyData: {
          email,
          checkUserPresent: true,
        },
      });

      console.log("OTP Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully! Check your email.");
      
      // Only navigate on successful OTP send
      navigate("/verify-email");
    } catch (error: any) {
      // Adjust 'any' to the appropriate error type if possible
      console.error("SENDOTP API ERROR:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Could Not Send OTP";
      toast.error(errorMessage);
      
      // DO NOT navigate if there's an error - user stays on signup page
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp({
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
}: SignUpParams) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));
    try {
      const response = await apiConnector({
        method: "POST",
        url: SIGNUP_API,
        bodyData: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          accountType,
          otp,
        },
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email: string, password: string, navigate: any) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector({
        method: "POST",
        url: LOGIN_API,
        bodyData: {
          email,
          password,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("login Successfully");
      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data?.token));

      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      );

      // Fetch cart after login
      try {
        const cartData = await getCart(response.data.token);
        if (cartData?.cart?.courses) {
          const { setCart } = await import("../../slices/cartSlice");
          dispatch(setCart(cartData.cart.courses));
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }

      navigate("/dashboard/profile");
    } catch (error) {
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email: string) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector({
        method: "POST",
        url: RESETPASSTOKEN_API,
        bodyData: {
          email,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
    } catch (error) {
      toast.error("Failed To Send Reset Email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(
  password: string,
  confirmPassword: string,
  token: string,
  navigate: any
) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector({
        method: "POST",
        url: RESETPASSWORD_API,
        bodyData: {
          password,
          confirmPassword,
          token,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate: any) {
  return (dispatch: Dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
