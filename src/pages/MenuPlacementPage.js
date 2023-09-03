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
  // const menuItemsPerPage = 8;

  // const [currentPage, setCurrentPage] = useState(1);

  const getMenuLists = useCallback(async () => {
    try {
      const res = await getFoods(sID);
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
    console.log(menuItems);

    const data = {
      f_list: menuItems.map((menuItem, index) => ({
        // pos 삭제 예정
        pos: index + 1,
        f_id: menuItem._id,
        f_num: menuItem.num,
      })),
    };

    console.log(data);

    try {
      await postMenu(sID, data);
    } catch (error) {
      console.log(error);
    }
  };

  /** 리스트 -> 페이지 이동 */
  // const handleNextPage = () => {
  //   if (canNextPage) {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (canPrevPage) {
  //     setCurrentPage((prevPage) => prevPage - 1);
  //   }
  // };

  // const startIndex = (currentPage - 1) * menuItemsPerPage;
  // const endIndex = startIndex + menuItemsPerPage;
  // const currentMenuItems = menuList.slice(startIndex, endIndex);

  // const canPrevPage = currentPage > 1;
  // const canNextPage = endIndex < menuList.length;

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
          {/* <div className={MPlace.buttons}>
            <button onClick={handlePrevPage} disabled={!canPrevPage}>
              {"<"}
            </button>
            <button onClick={handleNextPage} disabled={!canNextPage}>
              {">"}
            </button>
          </div> */}
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
