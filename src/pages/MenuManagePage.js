import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";

import axios from "axios";
import { getMenus, putMenus } from "../components/API.module";
import Dropzone from "react-dropzone";
import "swiper/swiper-bundle.css";

import { useState, useEffect } from "react";

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

  const handleAddMenu = () => {
    const newMenu = `메뉴${menus.length + 1}`;
    setMenus([...menus, newMenu]);
  };

  const handleDeleteMenu = (index) => {
    const newMenus = [...menus];
    newMenus.splice(index, 1);
    setMenus(newMenus);

    const newButtons = [...showButtons];
    newButtons.splice(index, 1);
    setShowButtons(newButtons);
  };

  const toggleButton = (index) => {
    const newButtons = [...showButtons];
    newButtons[index] = !newButtons[index];
    setShowButtons(newButtons);
  };

  /**통신 부분 -> 모듈화 진행할 예정 */
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  /**사용자 입력값을 저장하는 변수 */
  const [editValue, setEditValue] = useState("");
  const [editMenu, setEditMenu] = useState(false);

  //GET 메서드
  useEffect(() => {
    //GET 요청을 보내서 데이터 반영
    const fetchMenu = async () => {
      try {
        /**요청 시작 시 error과 menu 초기화*/
        setError(null);
        setMenu([]);
        //loading 상태는 true로 세팅
        setLoading(true);

        const request = await getMenus("642506e3cc80984129fe0209");
        setMenu(request.data.response);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  /** edit descriptions of menu when click modify button */
  const [menuName, setMenuName] = useState(menu.name);
  const [menuDesc, setMenuDesc] = useState(menu.desc);
  const [menuAllergy, setMenuAllergy] = useState(menu.allergy);
  const [originItems, setOriginItems] = useState(menu.origin);
  const [menuPrice, setMenuPrice] = useState(menu.price);

  /** edit menuImage */
  const [menuImg, setMenuImg] = useState(null);
  const [menuImgMsg, setMenuImgMsg] = useState("메뉴 이미지 수정하기");
  const formData = new FormData(); //추가한 메뉴 이미지 저장

  /** 메뉴 세부내용 수정 */
  const handleEditMenuClick = (e, index) => {
    setMenuName(menu.name);
    setMenuDesc(menu.desc);
    setMenuAllergy(menu.allergy);
    setOriginItems(menu.origin);
    setMenuPrice(menu.price);
    setEditMenu(true);
  };

  /** 수정 내용 저장 */
  const handleSaveMenuClick = () => {
    putMenus("642506e3cc80984129fe0209", {
      ...menu,
      name: menuName,
      price: menuPrice,
      desc: menuDesc,
      allergy: menuAllergy,
      origin: originItems,
    })
      .then((res) => {
        setMenu((prevState) => ({
          ...prevState,
          name: menuName,
          price: menuPrice,
          desc: menuDesc,
          allergy: menuAllergy,
          origin: originItems,
        }));
        setEditMenu(false);
      })
      .catch((e) => {
        console.log(e.response);
      });
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
        <hr className={Menu.vertical} />
        <section className="menuInfo">
          <div className={Menu.info}>
            {editMenu ? (
              <input
                className={Menu.menuName}
                type="text"
                value={menuName}
                cols="true"
                onChange={(e) => setMenuName(e.target.value)}
              />
            ) : (
              <h2>{menu.name}</h2>
            )}
            <div className={Bar.line}>
              <div className={Bar.circle}></div>
            </div>
            <div className={Menu.Img}>
              <img
                className={Menu.menuImg}
                src={require("../images/tizle.jpeg")}
                alt="메뉴: 티즐"
              />
              <img
                className={Menu.editBtn}
                src={require("../images/edit.jpeg")}
                alt="메뉴 이미지 수정하기"
              />
            </div>
            <br />
            <div className={Menu.details}>
              <div className={Menu.description}>
                <h3>메뉴 설명</h3>
                {editMenu ? (
                  <textarea
                    type="text"
                    value={menuDesc}
                    cols="true"
                    rows="3"
                    onChange={(e) => setMenuDesc(e.target.value)}
                  />
                ) : (
                  <p>{menu.desc}</p>
                )}
              </div>
              <div className={Menu.allergy}>
                <h3>알레르기</h3>
                {editMenu ? (
                  <textarea
                    type="text"
                    value={menuAllergy}
                    cols="true"
                    rows="2"
                    onChange={(e) => setMenuAllergy(e.target.value)}
                  />
                ) : (
                  <p>{menu.allergy}</p>
                )}
              </div>
              <div className={Menu.origin}>
                <h3>원산지 표기</h3>
                {editMenu ? (
                  <textarea
                    type="text"
                    value={originItems}
                    cols="true"
                    rows="3"
                    onChange={(e) => setOriginItems(e.target.value)}
                  />
                ) : (
                  <p>{menu.origin}</p>
                )}
              </div>
              <div className={Menu.price}>
                <h3>가격</h3>
                {editMenu ? (
                  <textarea
                    type="text"
                    value={menuPrice}
                    cols="true"
                    rows="1"
                    onChange={(e) => setMenuPrice(e.target.value)}
                  />
                ) : (
                  <p>{menu.price}</p>
                )}
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
