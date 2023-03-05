import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import "swiper/swiper-bundle.css";

import { useState } from "react";

function MenuManagePage() {
  const [menus, setMenus] = useState([
    "1. 메뉴1",
    "2. 메뉴2",
    "3. 메뉴3",
    "4. 메뉴4",
    "5. 메뉴5",
  ]);

  function handleAddMenu() {
    const newMenu = `${menus.length + 1}. 메뉴${menus.length + 1}`;
    setMenus([...menus, newMenu]);
  }

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Menu.inner}>
        <section className="menus">
          <div className={Menu.menus}>
            <h3>00가게</h3>
            <ul>
              {menus.map((menu, index) => (
                <li key={index} data-hammer className={Menu.list}>
                  {menu}
                </li>
              ))}
            </ul>
            <button className={Button.plus} onClick={handleAddMenu}>
              +
            </button>
          </div>
        </section>
        <hr className={Main.vertical} />
        <section className="menuInfo">
          <div className={Menu.info}>
            <h3>메뉴1</h3>
            <img src={require("../images/burger.jpeg")} alt="메뉴1 사진"></img>
            <br />
            <p>
              메뉴 설명
              <br />
              <br />
              알레르기 정보
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MenuManagePage;
