import { useEffect, useState } from "react";

import TM from "../css/TheMenus.module.css";
import { getMenus } from "./API.module";

function TheMenus() {
  const sID = localStorage.getItem("storeID");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    getMenuItems();
  }, []);

  const getMenuItems = async () => {
    try {
      const res = await getMenus(`/q?s_id=${sID}`);
      const mID = res.data.response[0]._id;

      const resFood = await getMenus(`/menu/foods?id=${mID}`);
      setMenuItems(resFood.data.response.f_list);
    } catch (error) {
      console.error(`menu-items GET error:`, error);
    }
  };

  return (
    <div className={TM.menuContainer}>
      {menuItems.map((item, index) => (
        <div key={index} className={TM.menuItem}>
          <img
            src={`https://foodineye.s3.ap-northeast-2.amazonaws.com/${item.img_key}`}
            alt="이미지 없음"
            className={TM.menuItemImg}
          />
          <div className={TM.menuItemDetails}>
            <div className={TM.menuItemName}>{item.name}</div>
            <div className={TM.menuItemPrice}>{item.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TheMenus;
