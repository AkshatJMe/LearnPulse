import { apiConnector } from "../apiConnector";
import { wishlistEndpoints } from "../apis";

const {
  GET_WISHLIST_API,
  ADD_TO_WISHLIST_API,
  REMOVE_FROM_WISHLIST_API,
  TOGGLE_WISHLIST_API,
} = wishlistEndpoints;

// ================ Wishlist APIs ================

export const getWishlist = async (token: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_WISHLIST_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addToWishlist = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: ADD_TO_WISHLIST_API,
      bodyData: { courseId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const removeFromWishlist = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: REMOVE_FROM_WISHLIST_API,
      bodyData: { courseId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const toggleWishlist = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: TOGGLE_WISHLIST_API,
      bodyData: { courseId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
