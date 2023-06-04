import { useEffect, useState } from "react";

import TM from "../css/TheMenus.module.css";
import { getMenus } from "./API.module";

function TheMenus({ isEditMode }) {
  const sID = localStorage.getItem("storeID");
  const [menuItems, setMenuItems] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setIsDragOver(false);

    const data = e.dataTransfer.getData("text/plain");
    const draggedMenuItem = JSON.parse(data);
    console.log(draggedMenuItem);
    const targetIndex = index;
    console.log(targetIndex);

    setMenuItems((prevMenuItems) => {
      const updatedMenuItems = [...prevMenuItems];
      updatedMenuItems.splice(targetIndex, 1, draggedMenuItem);

      return updatedMenuItems;
    });
  };

  const handleMouseOver = (index) => {
    if (isDragOver && isEditMode) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (isDragOver && isEditMode) {
      setHoveredIndex(null);
    }
  };

  return (
    <div
      className={TM.menuContainer}
      onDragOver={handleDragOver}
      onMouseLeave={handleMouseLeave}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`${TM.menuItem} ${
            isEditMode && hoveredIndex === index ? TM.gridHovered : ""
          }`}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onDragEnter={() => setHoveredIndex(index)}
          onDragLeave={() => setHoveredIndex(null)}
          onDrop={(e) => handleDrop(e, index)}
        >
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
