import { useCallback, useEffect, useState } from "react";

import TM from "../css/TheMenus.module.css";
import { getMenus, getFoods } from "./API.module";

function TheMenus({ isEditMode, menuItems, setMenuItems }) {
  const sID = localStorage.getItem("storeID");
  // const [menuItems, setMenuItems] = useState([]);
  const [foodCount, setFoodCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getMenuItems = useCallback(async () => {
    try {
      const res = await getMenus(`/q?s_id=${sID}`);
      const mID = res.data.response[0]._id;
      const resMenu = await getMenus(`/menu/foods?id=${mID}`);

      const resFood = await getFoods(sID);

      setMenuItems(resMenu.data.response.f_list || []);
      setFoodCount(resFood.data.response.length);
    } catch (error) {
      console.error(`menu-items GET error: ${error}`);
    }
  }, [sID, setMenuItems]);

  useEffect(() => {
    if (!isEditMode) {
      getMenuItems();
    }
  }, [isEditMode, getMenuItems]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = useCallback(
    (e, index) => {
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
    },
    [setMenuItems]
  );

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

  const totalCells = foodCount > 0 ? foodCount : 9;

  const generateEmptyMenu = () => {
    return Array.from({ length: totalCells }).map((_, index) => {
      if (index % 3 === 0) {
        return (
          <tr key={index}>
            {[0, 1, 2].map((i) => (
              <td
                key={i}
                className={`${TM.menuItem} ${
                  isEditMode && hoveredIndex === index + i ? TM.gridHovered : ""
                }`}
                onMouseOver={() => handleMouseOver(index + i)}
                onMouseLeave={handleMouseLeave}
                onDragEnter={() => setHoveredIndex(index + i)}
                onDragLeave={() => setHoveredIndex(null)}
                onDrop={(e) => handleDrop(e, index + i)}
              >
                <div className={TM.menuItemText}>메뉴 추가</div>
              </td>
            ))}
          </tr>
        );
      }
      return null;
    });
  };

  const generateMenu = () => {
    const menu = [];

    for (let i = 0; i < totalCells; i += 3) {
      const startIndex = i;
      const group = menuItems.slice(startIndex, startIndex + 3);

      menu.push(
        <tr key={startIndex}>
          {group.map((menuItem, columnIndex) => (
            <td
              key={columnIndex}
              className={`${TM.menuItem} ${
                isEditMode && hoveredIndex === startIndex + columnIndex
                  ? TM.gridHovered
                  : ""
              }`}
              onMouseOver={() => handleMouseOver(startIndex + columnIndex)}
              onMouseLeave={handleMouseLeave}
              onDragEnter={() => setHoveredIndex(startIndex + columnIndex)}
              onDragLeave={() => setHoveredIndex(null)}
              onDrop={(e) => handleDrop(e, startIndex + columnIndex)}
            >
              <img
                src={`https://foodineye2.s3.ap-northeast-2.amazonaws.com/${menuItem.img_key}`}
                alt="이미지 없음"
                className={TM.menuItemImg}
              />
              <div className={TM.menuItemDetails}>
                <div className={TM.menuItemName}>{menuItem.name}</div>
                <div className={TM.menuItemPrice}>{menuItem.price}</div>
              </div>
            </td>
          ))}
          {group.length < 3 &&
            Array.from({ length: 3 - group.length }).map((_, columnIndex) => (
              <td
                key={group.length + columnIndex}
                className={TM.menuItem}
                onMouseOver={() =>
                  handleMouseOver(startIndex + group.length + columnIndex)
                }
                onMouseLeave={handleMouseLeave}
                onDragEnter={() =>
                  setHoveredIndex(startIndex + group.length + columnIndex)
                }
                onDragLeave={() => setHoveredIndex(null)}
                onDrop={(e) =>
                  handleDrop(e, startIndex + group.length + columnIndex)
                }
              ></td>
            ))}
        </tr>
      );
    }
    return menu;
  };

  const menu = menuItems.length > 0 ? generateMenu() : generateEmptyMenu();

  return (
    <table
      className={TM.menuTable}
      onDragOver={handleDragOver}
      onMouseLeave={handleMouseLeave}
    >
      <tbody>{menu}</tbody>
    </table>
  );
}

export default TheMenus;
