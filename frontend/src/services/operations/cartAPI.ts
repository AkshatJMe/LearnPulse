import { apiConnector } from "../apiConnector";
import { cartEndpoints } from "../apis";

const {
  GET_CART_API,
  ADD_TO_CART_API,
  REMOVE_FROM_CART_API,
  CLEAR_CART_API,
} = cartEndpoints;

// ================ Cart APIs ================

export const getCart = async (token: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_CART_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addToCart = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: ADD_TO_CART_API,
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

export const removeFromCart = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: REMOVE_FROM_CART_API,
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

export const clearCart = async (token: string) => {
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: CLEAR_CART_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
