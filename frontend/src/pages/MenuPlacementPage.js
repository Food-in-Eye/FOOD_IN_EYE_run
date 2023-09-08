import MenuBar from "../components/MenuBar";
import TheMenus from "../components/TheMenus.module";
import Button from "../css/Button.module.css";
import MPlace from "../css/MenuPlacement.module.css";
import arrow from "../images/right_arrow.jpeg";

import { getFoods, postMenu } from "../components/API.module";
import { useState, useEffect, useCallback } from "react";
import useTokenRefresh from "../components/useTokenRefresh";

function MenuPlacementPage() {
  useTokenRefresh();

  const sID = localStorage.getItem("s_id");
  const [storeOpen, setStoreOpen] = useState(false);
  const [storeClosed, setStoreClosed] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const getMenuLists = useCallback(async () => {
    try {
      const res = await getFoods(sID);
      console.log("getFoods", res);
      setMenuList(res.data.response);
    } catch (error) {
      console.log(`GET foods error:`, error);
    }
  }, [sID]);

  useEffect(() => {
    setStoreOpen(localStorage.getItem("storeOpen"));
    setStoreClosed(localStorage.getItem("storeClosed"));

    getMenuLists();
  }, [getMenuLists]);

  const handleEditBtnClick = () => {
    if (storeOpen === "true" && storeClosed === "false") {
      alert("가게를 닫고 진행해주세요!");
    } else if (storeOpen === "false" && storeClosed === "true") {
      setIsEditMode(true);
    }
  };

  const handleSaveBtnClick = async (e) => {
    setIsEditMode(false);

    const data = {
      f_list: menuItems.map((menuItem) => ({
        f_id: menuItem.f_id,
        f_num: menuItem.num,
      })),
    };

    try {
      await postMenu(sID, data).then((res) => console.log(res));
    } catch (error) {
      if (error.response.state === 503) {
        console.log(error.response.data.detail);
      }
      console.log(error);
    }
  };

  const handleDragStart = (e, menuItem) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(menuItem));
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={MPlace.inner}>
        <div className={MPlace.menus}>
          <h2>
            <span>메뉴 리스트</span>
          </h2>
          <ul>
            {menuList.map((menu, index) => (
              <li
                key={menu._id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, menu)}
              >
                {`${index + 1}. ${menu.name}`}
              </li>
            ))}
          </ul>
        </div>
        <div className={MPlace.middle}>
          <p>
            드래그앤 드롭으로
            <br />
            메뉴판을 손쉽게 바꾸세요!
          </p>
          <img src={arrow} alt="화살표 이미지" />
        </div>
        <div className={MPlace.theMenu}>
          <div className={MPlace.headOfTheMenu}>
            <h2>메뉴판</h2>
            {isEditMode ? (
              <button className={Button.saveMenu} onClick={handleSaveBtnClick}>
                저장하기
              </button>
            ) : (
              <button
                className={Button.modifyMenu}
                onClick={handleEditBtnClick}
              >
                수정하기
              </button>
            )}
          </div>
          <div className={MPlace.contentsOfTheMenu}>
            <TheMenus
              isEditMode={isEditMode}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuPlacementPage;
