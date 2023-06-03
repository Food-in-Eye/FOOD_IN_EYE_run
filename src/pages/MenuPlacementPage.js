import MenuBar from "../components/MenuBar";
import TheMenus from "../components/TheMenus.module";
import Button from "../css/Button.module.css";
import MPlace from "../css/MenuPlacement.module.css";
import arrow from "../images/right_arrow.jpeg";

import { getFoods } from "../components/API.module";
import { useState, useEffect } from "react";

function MenuPlacementPage() {
  const sID = localStorage.getItem("storeID");
  const [menuList, setMenuList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const menuItemsPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getMenuLists();
  });

  const getMenuLists = async () => {
    try {
      const res = await getFoods(sID);
      setMenuList(res.data.response);
    } catch (error) {
      console.log(`GET foods error:`, error);
    }
  };

  const handleEditBtnClick = () => {
    setIsEditMode(true);
  };

  const handleSaveBtnClick = () => {
    setIsEditMode(false);
  };

  const handleNextPage = () => {
    if (canNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (canPrevPage) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * menuItemsPerPage;
  const endIndex = startIndex + menuItemsPerPage;
  const currentMenuItems = menuList.slice(startIndex, endIndex);

  const canPrevPage = currentPage > 1;
  const canNextPage = endIndex < menuList.length;

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
            {currentMenuItems.map((menuItem, index) => (
              <li key={index}>
                {(currentPage - 1) * menuItemsPerPage +
                  index +
                  1 +
                  ". " +
                  menuItem.name}
              </li>
            ))}
          </ul>
          <div className={MPlace.buttons}>
            <button onClick={handlePrevPage} disabled={!canPrevPage}>
              {"<"}
            </button>
            <button onClick={handleNextPage} disabled={!canNextPage}>
              {">"}
            </button>
          </div>
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
          <h2>메뉴판</h2>
          <TheMenus isEditMode={isEditMode} />
          {isEditMode ? (
            <button className={Button.saveMenu} onClick={handleSaveBtnClick}>
              저장하기
            </button>
          ) : (
            <button className={Button.modifyMenu} onClick={handleEditBtnClick}>
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuPlacementPage;
