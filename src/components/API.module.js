import axios from "axios";

const USER_URL = "/api/v2/users";
const STORE_URL = "/api/v2/stores";
const FOODS_URL = "/api/v2/foods";
const ORDER_URL = "/api/v2/orders";
const MENUS_URL = "/api/v2/menus";
const JSON_FILES_URL = "/api/v2/s3/keys";

/**axios 인스턴스 생성 */
export const axiosInstance = axios.create({
  baseURL: ``,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosFormDataInstance = axios.create({
  baseURL: ``,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
//--------------------------------------------------------------
export const getStore = (s_id) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;

  console.log("getstore a_token", localStorage.getItem("a_token"));
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getFoods = (s_id) => {
  const requestUrl = `${FOODS_URL}/q?s_id=${s_id}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getFood = (f_id) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getOrders = (query) => {
  const requestUrl = `${ORDER_URL}/q${query}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getOrderHistory = (query) => {
  const requestUrl = `${ORDER_URL}/store/${query}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getMenus = (query) => {
  const requestUrl = `${MENUS_URL}${query}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getGaze = (query) => {
  const requestUrl = `${JSON_FILES_URL}${query}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const getFilteredGaze = (query) => {
  const requestUrl = `/anlz/v1/filter/exp${query}`;
  return axios.get(requestUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
    },
  });
};

export const putStore = (s_id, data) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const putFoods = (f_id, data) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const putOrderStatus = (o_id) => {
  const requestUrl = `${ORDER_URL}/order/status?id=${o_id}`;

  return axios.put(requestUrl);
};

export const postUser = (query, data) => {
  const requestUrl = `${USER_URL}${query}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const postLogin = (query, formData) => {
  const requestUrl = `${USER_URL}${query}`;

  return axios.post(requestUrl, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const postStore = (u_id, data) => {
  const requestUrl = `${STORE_URL}/store?u_id=${u_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const postPWCheck = (u_id, data) => {
  const requestUrl = `${USER_URL}/info?u_id=${u_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const postFood = (s_id, data) => {
  const requestUrl = `${FOODS_URL}/food?s_id=${s_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const postMenu = (s_id, data) => {
  const requestUrl = `${MENUS_URL}/menu?s_id=${s_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("a_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
