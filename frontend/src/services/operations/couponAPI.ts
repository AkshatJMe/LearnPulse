import { apiConnector } from "../apiConnector";
import { couponEndpoints } from "../apis";

const {
  VALIDATE_COUPON_API,
  GET_ALL_COUPONS_API,
  CREATE_COUPON_API,
  GET_COUPON_API,
  UPDATE_COUPON_API,
  DELETE_COUPON_API,
} = couponEndpoints;

export async function validateCoupon(
  couponCode: string,
  amount?: number,
  courseId?: string
) {
  let result: any = null;
  try {
    const params = new URLSearchParams();
    params.append("coupon", couponCode);
    if (amount) params.append("amount", amount.toString());
    if (courseId) params.append("courseId", courseId);

    const response = await apiConnector({
      method: "GET",
      url: `${VALIDATE_COUPON_API}?${params.toString()}`,
    });

    if (response?.data?.success) {
      result = {
        discount: response?.data?.discount || 0,
        coupon: response?.data?.coupon || null,
      };
    } else {
      throw new Error(response?.data?.message || "Invalid coupon code");
    }
  } catch (error) {
    console.error("Coupon Validation Error:", error);
    throw error;
  }
  return result;
}

export async function getAllCoupons(token: string) {
  let result: any[] = [];
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_COUPONS_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.coupons || [];
    } else {
      throw new Error(response?.data?.message || "Failed to fetch coupons");
    }
  } catch (error) {
    console.error("Get All Coupons Error:", error);
  }
  return result;
}

export async function createCoupon(couponData: any, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_COUPON_API,
      bodyData: couponData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.coupon;
    } else {
      throw new Error(response?.data?.message || "Failed to create coupon");
    }
  } catch (error) {
    console.error("Create Coupon Error:", error);
    throw error;
  }
  return result;
}

export async function getCoupon(couponId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "GET",
      url: `${GET_COUPON_API}/${couponId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.coupon;
    } else {
      throw new Error(response?.data?.message || "Failed to fetch coupon");
    }
  } catch (error) {
    console.error("Get Coupon Error:", error);
    throw error;
  }
  return result;
}

export async function updateCoupon(couponId: string, couponData: any, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "PUT",
      url: `${UPDATE_COUPON_API}/${couponId}`,
      bodyData: couponData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.coupon;
    } else {
      throw new Error(response?.data?.message || "Failed to update coupon");
    }
  } catch (error) {
    console.error("Update Coupon Error:", error);
    throw error;
  }
  return result;
}

export async function deleteCoupon(couponId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: `${DELETE_COUPON_API}/${couponId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.coupon || response?.data?.message;
    } else {
      throw new Error(response?.data?.message || "Failed to delete coupon");
    }
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    throw error;
  }
  return result;
}
