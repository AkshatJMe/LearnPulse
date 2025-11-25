import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Create an instance of Axios with default configuration
export const axiosInstance = axios.create({});

// Define types for the parameters used in apiConnector function
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiConnectorParams {
  method: HttpMethod;
  url: string;
  bodyData?: any;
  headers?: any;
  params?: any;
}

export const apiConnector = ({
  method,
  url,
  bodyData,
  headers,
  params,
}: ApiConnectorParams): Promise<any> => {
  const axiosConfig: AxiosRequestConfig = {
    method: method,
    url: url,
    data: bodyData ?? null,
    headers: headers,
    params: params ?? null,
  };

  const tryRequest = async (config: AxiosRequestConfig) => {
    try {
      const response: AxiosResponse<any> = await axiosInstance(config);
      return response;
    } catch (error: any) {
      const originalUrl = String(config.url || "");
      const canRetryTo4001 =
        originalUrl.includes("localhost:4000") &&
        !originalUrl.includes("localhost:4001");

      // Retry once when backend auto-shifts port from 4000 to 4001
      if (!error?.response && canRetryTo4001) {
        const fallbackUrl = originalUrl.replace("localhost:4000", "localhost:4001");
        const retryConfig: AxiosRequestConfig = {
          ...config,
          url: fallbackUrl,
        };

        try {
          return await axiosInstance(retryConfig);
        } catch (retryError: any) {
          if (retryError.response) {
            console.error("Response data:", retryError.response.data);
            console.error("Response status:", retryError.response.status);
            console.error("Response headers:", retryError.response.headers);
          } else if (retryError.request) {
            console.error("Request:", retryError.request);
          } else {
            console.error("Error message:", retryError.message);
          }
          console.error("Error config:", retryError.config);
          throw retryError;
        }
      }

      // Handle Axios errors here
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
      throw error; // Rethrow the error to propagate it further
    }
  };

  return tryRequest(axiosConfig);
};
