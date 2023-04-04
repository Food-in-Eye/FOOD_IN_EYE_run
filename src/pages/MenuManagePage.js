import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";
import "swiper/swiper-bundle.css";

import { useState } from "react";

function MenuManagePage() {
  /** add menus */
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

  /** edit descriptions of menu when click modify button */
  const [menuDesc, setMenuDesc] = useState(
    "새우와 청양마요가 잘어울리는 햄버거"
  );
  const [allergy, setAllergy] = useState("아보카도, 새우");
  const [originItems, setOriginItems] = useState([]);
  const [price, setPrice] = useState("5000");

  /**현재 수정 중인 originItem의 index */
  const [editingIndex, setEditingIndex] = useState(-1);
  /**사용자 입력값을 저장하는 변수 */
  const [editValue, setEditValue] = useState("");
  const [editMenu, setEditMenu] = useState(false);

  /** 메뉴 정보 수정 & 원산지 수정할 때 엔터키 이벤트 발생할 경우 새로운 <li> 추가 */
  const handleEditMenuClick = (e, index) => {
    e.stopPropagation();

    setMenuDesc(menuDesc);
    setAllergy(allergy);
    setPrice(price);

    setEditingIndex(index);
    setEditValue(originItems[index].text);
    setEditMenu(true);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      addOriginItem();
    }
  };

  const addOriginItem = () => {
    const newItem = { text: editValue, completed: false };
    if (editingIndex >= 0) {
      const newItems = [...originItems];
      newItems[editingIndex] = newItem;
      setOriginItems(newItems);
      setEditingIndex(-1);
    } else {
      //새로운 아이템 추가
      setOriginItems([...originItems, newItem]);
    }
    setEditMenu(""); //입력값 초기화
  };

  /** 수정 내용 저장 */
  const handleSaveMenuClick = () => {
    const newOriginItems = [...originItems];
    newOriginItems[editingIndex] = {
      ...newOriginItems[editingIndex],
      text: editValue,
    };
    setOriginItems(newOriginItems);
    setEditingIndex(-1);
    setEditValue("");

    setEditMenu(false);
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
                {editMenu ? (
                  <input
                    type="text"
                    value={menuDesc}
                    cols="true"
                    onChange={(e) => setMenuDesc(e.target.value)}
                  />
                ) : (
                  <p>새우와 청양마요가 잘어울리는 햄버거</p>
                )}
              </div>
              <div className={Menu.allergy}>
                <h3>알레르기</h3>
                {editMenu ? (
                  <input
                    type="text"
                    value={allergy}
                    cols="true"
                    onChange={(e) => setAllergy(e.target.value)}
                  />
                ) : (
                  <p>아보카도, 새우</p>
                )}
              </div>
              <div className={Menu.origin}>
                <h3>원산지 표기</h3>
                <ul>
                  {originItems.map((item, index) => (
                    <li key={index}>
                      {editingIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={
                              editingIndex >= 0 ? handleKeyPress : null
                            } //enter key event 처리
                          />
                        </>
                      ) : (
                        //일반 모드의 경우
                        <>{item.text}</>
                      )}
                    </li>
                  ))}
                  <li>아보카도(국산)</li>
                  <li>새우(중국산)</li>
                </ul>
              </div>
              <div className={Menu.price}>
                <h3>가격</h3>
                <p>5000</p>
              </div>
            </div>
            <div className={Menu.buttons}>
              {editMenu ? (
                <button
                  className={Button.saveMenu}
                  onClick={handleSaveMenuClick}
                >
                  저장하기
                </button>
              ) : (
                <button
                  className={Button.modifyMenu}
                  onClick={handleEditMenuClick}
                >
                  수정하기
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MenuManagePage;
