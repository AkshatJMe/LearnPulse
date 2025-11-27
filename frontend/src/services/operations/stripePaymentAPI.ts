import { apiConnector } from "../apiConnector";
import { stripeEndpoints } from "../apis";

const {
  CREATE_CHECKOUT_SESSION_API,
  VERIFY_SESSION_API,
  GET_PAYMENT_HISTORY_API,
} = stripeEndpoints;

// ================ Stripe Payment APIs ================

export const createCheckoutSession = async (
  coursesId: string[],
  couponCode: string | undefined,
  token: string
) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_CHECKOUT_SESSION_API,
      bodyData: { coursesId, couponCode },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyPayment = async (sessionId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: VERIFY_SESSION_API,
      bodyData: { sessionId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getPaymentHistory = async (token: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_PAYMENT_HISTORY_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
