import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFoods } from "../components/API.module";
import MenuBar from "../components/MenuBar";
import Select from "../css/SelectMenu.module.css";
import useTokenRefresh from "../components/useTokenRefresh";

function SelectMenuPage() {
  useTokenRefresh();

  const navigate = useNavigate();
  const sID = localStorage.getItem("s_id");
  const [menuList, setMenuList] = useState([]);

  const getMenuLists = useCallback(async () => {
    try {
      const res = await getFoods(sID);
      setMenuList(res.data.food_list);
    } catch (error) {
      console.log(`GET foods error:`, error);
    }
  }, [sID]);

  useEffect(() => {
    getMenuLists();
  }, [getMenuLists]);

  const handleClickedMenu = async (e) => {
    navigate("/menu-report");
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Select.inner}>
        <div className={Select.upper}>
          <span>메뉴 리스트</span>
          <p>분석을 보고싶은 메뉴를 선택하세요!</p>
        </div>
        <div className={Select.menus}>
          <ul>
            {menuList.map((menu, index) => (
              <li key={menu._id} draggable={true} onClick={handleClickedMenu}>
                {`${index + 1}. ${menu.name}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SelectMenuPage;
