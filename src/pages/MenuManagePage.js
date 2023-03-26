import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";
import "swiper/swiper-bundle.css";

import { useState } from "react";

function MenuManagePage() {
  const [menus, setMenus] = useState([
    "메뉴1",
    "메뉴2",
    "메뉴3",
    "메뉴4",
    "메뉴5",
  ]);
  const [showButtons, setShowButtons] = useState(
    Array(menus.length).fill(false)
  );

  function handleAddMenu() {
    const newMenu = `메뉴${menus.length + 1}`;
    setMenus([...menus, newMenu]);
  }

  function handleDeleteMenu(index) {
    const newMenus = [...menus];
    newMenus.splice(index, 1);
    setMenus(newMenus);

    const newButtons = [...showButtons];
    newButtons.splice(index, 1);
    setShowButtons(newButtons);
  }

  const toggleButton = (index) => {
    const newButtons = [...showButtons];
    newButtons[index] = !newButtons[index];
    setShowButtons(newButtons);
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Menu.inner}>
        <section className="menus">
          <div className={Menu.menus}>
            <h1>Menu</h1>
            <div className={Bar.line}>
              <div className={Bar.circle}></div>
            </div>
            <ul>
              {menus.map((menu, index) => (
                <li
                  key={index}
                  data-hammer
                  className={Menu.list}
                  onClick={() => toggleButton(index)}
                >
                  <span>{menu}</span>
                  {showButtons[index] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMenu(index);
                      }}
                    >
                      삭제
                    </button>
                  )}
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
            <h2>메뉴1</h2>
            <div className={Bar.line}>
              <div className={Bar.circle}></div>
            </div>
            <img src={require("../images/burger.jpeg")} alt="메뉴1 사진"></img>
            <br />
            <div className={Menu.details}>
              <div className={Menu.description}>
                <h3>메뉴 설명</h3>
                <p>새우와 청양마요가 잘어울리는 햄버거</p>
              </div>
              <div className={Menu.allergy}>
                <h3>알레르기</h3>
                <p>아보카도, 새우</p>
              </div>
              <div className={Menu.origin}>
                <h3>원산지 표기</h3>
                <ul>
                  <li>아보카도(국산)</li>
                  <li>새우(중국산)</li>
                </ul>
              </div>
            </div>
            <div className={Menu.buttons}>
              <button className={Button.modifyMenu}>수정하기</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MenuManagePage;
