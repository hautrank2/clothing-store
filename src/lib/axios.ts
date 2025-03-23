import axios, { ResponseType } from "axios";

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
  timeout: 55000,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config } = error;
    const originalRequest = config;
    const {
      response = {
        status: false,
        statusText: "Kết nối chậm, vui lòng thử lại sau!",
      },
    } = error;
    if (response) {
      const { status } = response;
      if (status === 403 && !originalRequest._retry) {
      }
      if (status === 404) {
      }
    }
    if (error.message === "Network Error") {
      error.message = "Lỗi mạng";
    }
    const returnValue = {
      status: response.status || error.code,
      statusText: response.statusText || error.message,
      data: response.data,
    };
    if (response.dataNotFound) {
    }
    return Promise.reject(returnValue);
  }
);
type Object = {
  [key: string]: any;
};

export const GET = async <T>(
  url: string,
  options?: { headers?: any; responseType?: ResponseType; params?: any }
): Promise<T> => {
  const response = await axiosClient.get<T>(url, {
    headers: options?.headers,
    params: options?.params,
    responseType: options?.responseType || "json",
  });
  return response.data;
};

export const POST = async <T>(
  url: string,
  body: T,
  options?: Object
): Promise<any> => {
  const response = await axiosClient.post(url, body, {
    headers: options?.headers,
    params: options?.params,
    ...options,
  });

  return response.data;
};

export const PATCH = async <T>(
  url: string,
  body: T,
  options?: Object
): Promise<any> => {
  const response = await axiosClient.patch(url, body, {
    headers: options?.headers,
    params: options?.params,
    ...options,
  });

  return response.data;
};

export const PUT = (url: string, body: any, options?: Object) =>
  new Promise(async (resolve, reject) => {
    axiosClient.put(url, body, options).then(resolve).catch(reject);
  });

export const DELETE = async <T>(
  url: string,
  options?: Object
): Promise<any> => {
  const response = await axiosClient.delete<T>(url, options);
  return response.data;
};

export default axiosClient;
