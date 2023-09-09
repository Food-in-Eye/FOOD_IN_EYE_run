import axios from "axios";
import { handleAccessToken } from "./JWT.module";

const USER_URL = "/api/v2/users";
const STORE_URL = "/api/v2/stores";
const FOODS_URL = "/api/v2/foods";
const ORDER_URL = "/api/v2/orders";
const MENUS_URL = "/api/v2/menus";
const JSON_FILES_URL = "/api/v2/s3/keys";

const apiInstance = axios.create({
  baseURL: ``,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const apiFormDataInstance = axios.create({
  baseURL: ``,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

async function retryOriginalRequest(error) {
  try {
    await handleAccessToken();

    const originalRequest = error.config;
    originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
      "a_token"
    )}`;
    return apiInstance(originalRequest);
  } catch (retryError) {
    return Promise.reject(retryError);
  }
}

// 요청 인터셉터: 요청 보내기 전 실행
apiInstance.interceptors.request.use((config) => {
  const aToken = localStorage.getItem("a_token");
  if (aToken) {
    config.headers.Authorization = `Bearer ${aToken}`;
  }
  return config;
});

// 요청 인터셉터: 응답을 받은 후 실행
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      if (error.response.data.detail === "Token has expired.") {
        return retryOriginalRequest(error);
      }
    } else if (
      (error.response.status === 403) |
      (error.response.status === 422)
    ) {
      console.log(error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

export const getStore = (s_id) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;
  return apiInstance.get(requestUrl);
};

export const getFoods = (s_id) => {
  const requestUrl = `${FOODS_URL}/q?s_id=${s_id}`;
  return apiInstance.get(requestUrl);
};

export const getFood = (f_id) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;
  return apiInstance.get(requestUrl);
};

export const getOrders = (query) => {
  const requestUrl = `${ORDER_URL}/q${query}`;
  return apiInstance.get(requestUrl);
};

export const getOrderHistory = (query) => {
  const requestUrl = `${ORDER_URL}/store/${query}`;
  return apiInstance.get(requestUrl);
};

export const getMenus = (query) => {
  const requestUrl = `${MENUS_URL}${query}`;
  return apiInstance.get(requestUrl);
};

export const getGaze = (query) => {
  const requestUrl = `${JSON_FILES_URL}${query}`;
  return apiInstance.get(requestUrl);
};

export const getFilteredGaze = (query) => {
  const requestUrl = `/anlz/v1/filter/exp${query}`;
  return apiInstance.get(requestUrl);
};

export const putStore = (s_id, data) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;
  return apiInstance.put(requestUrl, JSON.stringify(data));
};

export const putFoods = (f_id, data) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;

  return apiInstance.put(requestUrl, JSON.stringify(data));
};

export const putFoodImg = (query, formData) => {
  const requestUrl = `${FOODS_URL}${query}`;

  return apiFormDataInstance.put(requestUrl, formData);
};

export const putOrderStatus = (o_id) => {
  const requestUrl = `${ORDER_URL}/order/status?id=${o_id}`;

  return apiInstance.put(requestUrl);
};

export const putUser = (query, data) => {
  const requestUrl = `${USER_URL}${query}`;

  return apiInstance.put(requestUrl, JSON.stringify(data));
};

export const postUser = (query, data) => {
  const requestUrl = `${USER_URL}${query}`;

  return apiInstance.post(requestUrl, JSON.stringify(data));
};

export const postLogin = (query, formData) => {
  const requestUrl = `${USER_URL}${query}`;

  return apiFormDataInstance.post(requestUrl, formData, {
    // "Content-Type": "multipart/form-data",
  });
};

export const postStore = (query, data) => {
  const requestUrl = `${STORE_URL}${query}`;

  return apiInstance.post(requestUrl, JSON.stringify(data));
};

export const postPWCheck = (u_id, data) => {
  const requestUrl = `${USER_URL}/info?u_id=${u_id}`;

  return apiInstance.post(requestUrl, JSON.stringify(data));
};

export const postFood = (s_id, data) => {
  const requestUrl = `${FOODS_URL}/food?s_id=${s_id}`;

  return apiInstance.post(requestUrl, JSON.stringify(data));
};

export const postMenu = (s_id, data) => {
  const requestUrl = `${MENUS_URL}/menu?s_id=${s_id}`;

  return apiInstance.post(requestUrl, JSON.stringify(data));
};
