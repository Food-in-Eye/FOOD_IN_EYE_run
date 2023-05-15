import MenuBar from "../components/MenuBar";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {
  getFood,
  getFoods,
  putFoods,
  postFood,
} from "../components/API.module";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

function MenuManagePage() {
  // const sID = `641459134443f2168a32357b`; //일식가게 id
  const sID = `641458bd4443f2168a32357a`; //파스타가게 id

  /** api에서 불러올 menuList */
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [editMenu, setEditMenu] = useState(false);
  const [editMenuImg, setEditMenuImg] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState({});
  const [selectedMenuImgURL, setSelectedMenuImgURL] = useState(``);

  const selectedMenuIdRef = useRef();

  /** GET 메서드 */
  useEffect(() => {
    setError(null);
    setLoading(true);

    getFoods(sID)
      .then((res) => setMenuList(res.data.response))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const memorizedGetMenu = useMemo(
    () => getFood(selectedMenuIdRef.current),
    [selectedMenuIdRef.current]
  );

  /** 선택한 menu -> menuId에 따라 get */
  const handleMenuClick = useCallback(
    async (e, menuId) => {
      e.preventDefault();

      setSelectedMenu({});
      setSelectedMenuImgURL(``);
      selectedMenuIdRef.current = menuId;

      getFood(selectedMenuIdRef.current)
        .then((res) => {
          setSelectedMenu(res.data.response);
          if (res.data.response.img_key) {
            setSelectedMenuImgURL(
              `https://foodineye.s3.ap-northeast-2.amazonaws.com/${res.data.response.img_key}`
            );
          }
        })
        .catch((e) => setError(e));
    },
    [selectedMenuIdRef]
  );

  /** edit descriptions of menu when click modify button */
  const [menuName, setMenuName] = useState(selectedMenu.name);
  const [menuDesc, setMenuDesc] = useState(selectedMenu.desc);
  const [menuAllergy, setMenuAllergy] = useState(selectedMenu.allergy);
  const [originItems, setOriginItems] = useState(selectedMenu.origin);
  const [menuPrice, setMenuPrice] = useState(selectedMenu.price);

  /** 로컬에서 선택한 이미지로 메뉴 이미지 수정 */
  const [menuImg, setMenuImg] = useState(selectedMenu.img_key);
  const cropperRef = useRef(null);
  const [inputImage, setInputImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  /**새로운 메뉴 추가 */
  const handleAddNewMenu = (e) => {
    e.preventDefault();

    // POST 메서드를 통해 메뉴 최초 생성
    postFood(sID, {
      s_id: sID,
      name: "new Menu",
      price: 0,
      img_key: null,
      desc: "메뉴에 대한 설명을 입력하세요",
      allergy: "메뉴에 대한 알러지 정보를 입력하세요",
      origin: "메뉴에 대한 원산지 정보를 입력하세요",
    })
      .then(async (res) => {
        const newMenu = await getFood(res.data.document_id);
        setMenuList([...menuList, newMenu.data.response]);
      })
      .catch((e) => {
        setError(e);
      });
  };

  /** 메뉴 세부내용 수정 */
  const handleEditMenuClick = (e) => {
    e.preventDefault();

    if (selectedMenu && selectedMenu._id) {
      setMenuName(selectedMenu.name);
      setMenuDesc(selectedMenu.desc);
      setMenuImg(selectedMenuImgURL);
      setMenuAllergy(selectedMenu.allergy);
      setOriginItems(selectedMenu.origin);
      setMenuPrice(selectedMenu.price);
      setEditMenu(true);
    }
  };

  /** 메뉴 정보 - 수정 내용 저장 */
  const handleSaveMenuClick = useCallback(async (e) => {
    e.preventDefault();

    putFoods(selectedMenu._id, {
      ...selectedMenu,
      name: menuName,
      price: menuPrice,
      desc: menuDesc,
      allergy: menuAllergy,
      origin: originItems,
    })
      .then(() => {
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
          (menu) => menu._id === selectedMenuIdRef.current
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
        setError(e);
      });
  });

  const handleEditImgClick = (e) => {
    e.preventDefault();

    setMenuImg(selectedMenuImgURL);
    setEditMenuImg(true);
  };

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => {
      setCroppedImage(blob);
    });
  };

  //메뉴 이미지 업데이트
  const handleSaveImgClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    try {
      if (croppedImage.length !== 0) {
        formData.append("file", croppedImage); // key, value 추가

        axios
          .put(`/api/v2/foods/food/image?id=${selectedMenu._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res.data);
            console.log(res.data.img_url);
            setSelectedMenuImgURL(res.data.img_url);
            setEditMenuImg(false);
            setInputImage(null);
            setCroppedImage(null);
          })
          .catch((e) => {
            for (let key of formData.keys()) {
              console.log(key, ":", formData.get(key));
            }

            for (let value of formData.values()) {
              console.log(value);
            }

            console.log("put에러: ", e);
          });
      } else {
        setEditMenuImg(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
              <button className={Button.plus} onClick={handleAddNewMenu}>
                +
              </button>
            </div>
          </section>
          <hr className={Menu.vertical} />
          {selectedMenuIdRef.current && (
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
                <div className={Menu.infoUpper}>
                  <div className={Menu.imgButtons}>
                    {editMenuImg ? (
                      <button
                        className={Button.saveImgMenu}
                        onClick={(e) => handleSaveImgClick(e)}
                      >
                        저장하기
                      </button>
                    ) : (
                      <button
                        className={Button.modifyImgMenu}
                        onClick={(e) => handleEditImgClick(e)}
                      >
                        수정하기
                      </button>
                    )}
                  </div>
                  <div className={Menu.Img}>
                    {editMenuImg ? (
                      <form className={Menu.editMenus}>
                        <img
                          className={Menu.menuImg}
                          src={croppedImage}
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
                          name="file"
                          onChange={(e) =>
                            setInputImage(
                              URL.createObjectURL(e.target.files[0])
                            )
                          }
                        />
                        <Cropper
                          src={inputImage}
                          crop={onCrop}
                          ref={cropperRef}
                          className={Menu.crop}
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
                    <h3>알러지</h3>
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
          {!selectedMenuIdRef.current && (
            <h2 className={Menu.noMenuClicked}>메뉴를 선택해주세요.</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuManagePage;
