import { apiConnector } from "../apiConnector";
import { certificateEndpoints } from "../apis";

const {
  GENERATE_CERTIFICATE_API,
  GET_USER_CERTIFICATES_API,
  GET_CERTIFICATE_BY_ID_API,
  VERIFY_CERTIFICATE_API,
  DOWNLOAD_CERTIFICATE_API,
} = certificateEndpoints;

// ================ Certificate APIs ================

export const generateCertificate = async (courseId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "POST",
      url: GENERATE_CERTIFICATE_API,
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

export const getUserCertificates = async (token: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_USER_CERTIFICATES_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCertificateById = async (certificateId: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: `${GET_CERTIFICATE_BY_ID_API}/${certificateId}`,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyCertificate = async (certificateId: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: `${VERIFY_CERTIFICATE_API}/${certificateId}`,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const downloadCertificate = async (certificateId: string, token: string) => {
  try {
    const response = await apiConnector({
      method: "GET",
      url: `${DOWNLOAD_CERTIFICATE_API}/${certificateId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
