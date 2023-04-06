import axios from "axios";

const STORE_URL = "/api/v1/admin/stores";
const MENUS_URL = "/api/v1/admin/foods";

//가게 ID에 따라 URL을 동적으로 구성하는 getStore() 함수
export const getStore = (storeId) => {
  const requestUrl = `${STORE_URL}/${storeId}`;
  return axios.get(requestUrl);
};

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

/** ID 변경사항 적용할 예정(0407) */
//메뉴 ID에 따라 URL을 동적으로 구성하는 getMenus() 함수
export const getMenus = (menuId) => {
  const requestUrl = `${MENUS_URL}/${menuId}`;
  return axios.get(requestUrl);
};

//메뉴 ID에 따라 URL을 동적으로 구성하는 putMenus() 함수
export const putMenus = (menuId, data) => {
  const requestUrl = `${MENUS_URL}/${menuId}`;

  return axios.put(requestUrl, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
