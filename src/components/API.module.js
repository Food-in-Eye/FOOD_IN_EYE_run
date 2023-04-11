import axios from "axios";

const STORE_URL = "/api/v1/admin/stores";
const MENUS_URL = "/api/v1/admin/foods";
const FOOD_IMG_URL = MENUS_URL + "/image";

/** GET 메서드 */
//가게 ID에 따라 URL을 동적으로 구성하는 getStore() 함수
export const getStore = (storeId) => {
  const requestUrl = `${STORE_URL}/${storeId}`;
  return axios.get(requestUrl);
};

//메뉴 ID에 따라 URL을 동적으로 구성하는 getMenus() 함수
export const getMenus = (s_id) => {
  const requestUrl = `${MENUS_URL}/?s_id=${s_id}`;
  return axios.get(requestUrl);
};

export const getMenu = (m_id) => {
  const requestUrl = `${MENUS_URL}/${m_id}`;
  return axios.get(requestUrl);
};

/** PUT 메서드 */
//가게 ID에 따라 URL을 동적으로 구성하는 putStore() 함수
export const putStore = (storeId, data) => {
  const requestUrl = `${STORE_URL}/${storeId}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

//메뉴 ID에 따라 URL을 동적으로 구성하는 putMenus() 함수
export const putMenus = (s_id, data) => {
  const requestUrl = `${MENUS_URL}/${s_id}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
