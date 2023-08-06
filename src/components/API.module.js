import axios from "axios";

const STORE_URL = "/api/v2/stores";
const FOODS_URL = "/api/v2/foods";
const ORDER_URL = "/api/v2/orders";
const MENUS_URL = "/api/v2/menus";
const JSON_FILES_URL = "/api/v2/s3/keys";

export const getStore = (s_id) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;
  return axios.get(requestUrl);
};

export const getFoods = (s_id) => {
  const requestUrl = `${FOODS_URL}/q?s_id=${s_id}`;
  return axios.get(requestUrl);
};

export const getFood = (f_id) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;
  return axios.get(requestUrl);
};

export const getOrders = (query) => {
  const requestUrl = `${ORDER_URL}/q${query}`;
  return axios.get(requestUrl);
};

export const getOrderHistory = (query) => {
  const requestUrl = `${ORDER_URL}/store/${query}`;
  return axios.get(requestUrl);
};

export const getMenus = (query) => {
  const requestUrl = `${MENUS_URL}${query}`;
  return axios.get(requestUrl);
};

export const getGaze = (query) => {
  const requestUrl = `${JSON_FILES_URL}${query}`;
  return axios.get(requestUrl);
};

export const getFilteredGaze = (query) => {
  const requestUrl = `/anlz/v1/filter/exp${query}`;
  return axios.get(requestUrl);
};

export const putStore = (s_id, data) => {
  const requestUrl = `${STORE_URL}/store?id=${s_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const putFoods = (f_id, data) => {
  const requestUrl = `${FOODS_URL}/food?id=${f_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const putOrderStatus = (o_id) => {
  const requestUrl = `${ORDER_URL}/order/status?id=${o_id}`;

  return axios.put(requestUrl);
};

export const postFood = (s_id, data) => {
  const requestUrl = `${FOODS_URL}/food?s_id=${s_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const postMenu = (s_id, data) => {
  const requestUrl = `${MENUS_URL}/menu?s_id=${s_id}`;

  return axios.post(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
