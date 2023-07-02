import { useCallback, useEffect, useState } from "react";

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

  const handleDrop = useCallback((e, index) => {
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
  }, []);

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
    <table
      className={TM.menuTable}
      onDragOver={handleDragOver}
      onMouseLeave={handleMouseLeave}
    >
      <tbody>
        {menuItems.map((item, index) => {
          if (index % 3 === 0) {
            const group = menuItems.slice(index, index + 3);

            return (
              <tr key={index}>
                {group.map((menuItem, i) => (
                  <td
                    key={i}
                    className={`${TM.menuItem} ${
                      isEditMode && hoveredIndex === index + i
                        ? TM.gridHovered
                        : ""
                    }`}
                    onMouseOver={() => handleMouseOver(index + i)}
                    onMouseLeave={handleMouseLeave}
                    onDragEnter={() => setHoveredIndex(index + i)}
                    onDragLeave={() => setHoveredIndex(null)}
                    onDrop={(e) => handleDrop(e, index + i)}
                  >
                    <img
                      src={`https://foodineye.s3.ap-northeast-2.amazonaws.com/${menuItem.img_key}`}
                      alt="이미지 없음"
                      className={TM.menuItemImg}
                    />
                    <div className={TM.menuItemDetails}>
                      <div className={TM.menuItemName}>{menuItem.name}</div>
                      <div className={TM.menuItemPrice}>{menuItem.price}</div>
                    </div>
                  </td>
                ))}
              </tr>
            );
          }
          // column에 맞지 않는 요소는 빈 셀로 채우기
          if (index % 3 !== 0) {
            return null;
          }
        })}
      </tbody>
    </table>
  );
}

export default TheMenus;
