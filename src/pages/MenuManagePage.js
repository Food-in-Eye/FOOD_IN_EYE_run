import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";

import {
  getFoodImg,
  getMenu,
  getMenus,
  putMenus,
} from "../components/API.module";
// import "swiper/swiper-bundle.css";

import { useState, useEffect, useRef, useMemo } from "react";

function MenuManagePage() {
  /** api에서 불러올 menuList */
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [editMenu, setEditMenu] = useState(false);

  const [selectedMenuId, setSelectedMenuId] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [selectedMenuImgURL, setSelectedMenuImgURL] = useState(``);

  /** GET 메서드 */
  useEffect(() => {
    //GET 요청을 보내서 데이터 반영
    const fetchMenu = async () => {
      try {
        /**요청 시작 시 error과 menu 초기화*/
        setError(null);
        //loading 상태는 true로 세팅
        setLoading(true);

        const request = await getMenus("641459134443f2168a32357b");
        setMenuList(request.data.response);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  /**리렌더링 최적화 */
  const memorizedGetMenu = useMemo(
    () => getMenu(selectedMenuId),
    [selectedMenuId]
  );

  /** 선택한 menu -> menuId에 따라 get */
  async function handleMenuClick(e, menuId) {
    e.preventDefault();

    setSelectedMenuId(menuId);
    try {
      const requestMenu = await memorizedGetMenu;
      setSelectedMenu(requestMenu.data.response);
      setSelectedMenuImgURL(
        `https://foodineye.s3.ap-northeast-2.amazonaws.com/${requestMenu.data.response.img_key}`
      );
    } catch (e) {
      setError(e);
    }
  }

  /** 메뉴 삭제 관련 코드 */
  /** ----------------------------------------------------- */
  // const handleAddMenu = () => {
  //   const newMenu = ` 메뉴 `;
  //   setMenus([...menuList, newMenu]);
  // };

  // const [showButtons, setShowButtons] = useState(
  //   Array(menuList.length).fill(false)
  // );

  // const handleDeleteMenu = (index) => {
  //   const newMenus = [...menus];
  //   newMenus.splice(index, 1);
  //   setMenus(newMenus);

  //   const newButtons = [...showButtons];
  //   newButtons.splice(index, 1);
  //   setShowButtons(newButtons);
  // };

  // const toggleButton = (index) => {
  //   const newButtons = [...showButtons];
  //   newButtons[index] = !newButtons[index];
  //   setShowButtons(newButtons);
  // };
  /** ----------------------------------------------------- */

  /** edit descriptions of menu when click modify button */
  const [menuName, setMenuName] = useState(selectedMenu.name);
  const [menuDesc, setMenuDesc] = useState(selectedMenu.desc);
  const [menuAllergy, setMenuAllergy] = useState(selectedMenu.allergy);
  const [originItems, setOriginItems] = useState(selectedMenu.origin);
  const [menuPrice, setMenuPrice] = useState(selectedMenu.price);

  /** edit menuImage */
  const [menuImg, setMenuImg] = useState(selectedMenuImgURL);
  const imgRef = useRef(null);

  /** 메뉴 세부내용 수정 */
  const handleEditMenuClick = (e, index) => {
    e.preventDefault();

    setMenuName(selectedMenu.name);
    setMenuImg(selectedMenuImgURL);
    setMenuDesc(selectedMenu.desc);
    setMenuAllergy(selectedMenu.allergy);
    setOriginItems(selectedMenu.origin);
    setMenuPrice(selectedMenu.price);
    setEditMenu(true);
  };

  /** 수정 내용 저장 */
  const handleSaveMenuClick = (e) => {
    e.preventDefault();

    putMenus("641d952818f0b258e9ca025b", {
      ...selectedMenu,
      name: menuName,
      price: menuPrice,
      desc: menuDesc,
      allergy: menuAllergy,
      origin: originItems,
    })
      .then((res) => {
        setSelectedMenu({
          ...selectedMenu,
          name: menuName,
          price: menuPrice,
          desc: menuDesc,
          allergy: menuAllergy,
          origin: originItems,
        });
        setEditMenu(false);

        //menuList 상태 업데이트
        const menuIndex = menuList.findIndex(
          (menu) => menu._id === selectedMenuId
        );
        const updatedMenuList = [...menuList];
        updatedMenuList[menuIndex] = {
          ...selectedMenu,
          name: menuName,
          price: menuPrice,
          desc: menuDesc,
          allergy: menuAllergy,
          origin: originItems,
        };
        setMenuList(updatedMenuList);
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
      {menuList && (
        <div className={Menu.inner}>
          <section className="menus">
            <div className={Menu.menus}>
              <h1>Menu</h1>
              <div className={Bar.line}>
                <div className={Bar.circle}></div>
              </div>
              <ul>
                {menuList.map((menu) => (
                  <li
                    key={menu._id}
                    data-hammer
                    className={Menu.list}
                    onClick={(e) => handleMenuClick(e, menu._id)}
                  >
                    <span>{menu.name}</span>
                    {/* {showButtons[index] && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMenu(index);
                        }}
                      >
                        삭제
                      </button> */}
                  </li>
                ))}
              </ul>
              <button className={Button.plus}>+</button>
            </div>
          </section>
          <hr className={Menu.vertical} />
          {selectedMenu.length !== 0 && (
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
                  <h2>{selectedMenu.name}</h2>
                )}
                <div className={Bar.line}>
                  <div className={Bar.circle}></div>
                </div>
                <div className={Menu.Img}>
                  {editMenu ? (
                    <form className={Menu.editMenus}>
                      <img
                        className={Menu.menuImg}
                        src={selectedMenuImgURL}
                        alt="메뉴 이미지"
                      />
                      <label className={Menu.foodImgLabel} htmlFor="foodImg">
                        메뉴 이미지 추가
                      </label>
                      <br />
                      <input
                        className={Menu.foodImgInput}
                        type="file"
                        accept="image/*"
                        id="foodImg"
                        // onChange={saveImgFile}
                        ref={imgRef}
                      />
                    </form>
                  ) : selectedMenuImgURL !== "" ? (
                    <img
                      className={Menu.menuImg}
                      src={selectedMenuImgURL}
                      alt="메뉴 이미지"
                    />
                  ) : (
                    <img
                      className={Menu.menuImg}
                      src={""}
                      alt="메뉴 이미지 없음"
                    />
                  )}
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
                      <p>{selectedMenu.desc}</p>
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
                      <p>{selectedMenu.allergy}</p>
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
                      <p>{selectedMenu.origin}</p>
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
                      <p>{selectedMenu.price}</p>
                    )}
                  </div>
                </div>
                <div className={Menu.buttons}>
                  {editMenu ? (
                    <button
                      className={Button.saveMenu}
                      onClick={(e) => handleSaveMenuClick(e)}
                    >
                      저장하기
                    </button>
                  ) : (
                    <button
                      className={Button.modifyMenu}
                      onClick={(e) => handleEditMenuClick(e)}
                    >
                      수정하기
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
          {selectedMenu.length === 0 && (
            <h2 className={Menu.noMenuClicked}>메뉴를 선택해주세요.</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuManagePage;
