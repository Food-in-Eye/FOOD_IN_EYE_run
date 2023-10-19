import MenuBar from "../components/MenuBar";
import Menu from "../css/MenuManage.module.css";
import Button from "../css/Button.module.css";
import Bar from "../css/UnderBar.module.css";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {
  getFood,
  getFoods,
  putFoods,
  postFood,
  putFoodImg,
} from "../components/API.module";
import { useState, useEffect, useRef, useCallback } from "react";
import useTokenRefresh from "../components/useTokenRefresh";

function MenuManagePage() {
  useTokenRefresh();

  const sID = localStorage.getItem("s_id");

  /** api에서 불러올 menuList */
  const [menuList, setMenuList] = useState([]);

  const [editMenu, setEditMenu] = useState(false);
  const [editMenuImg, setEditMenuImg] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState({});
  const [selectedMenuImgURL, setSelectedMenuImgURL] = useState(``);

  const selectedMenuIdRef = useRef();

  useEffect(() => {
    getFoods(sID)
      .then((res) => setMenuList(res.data.food_list))
      .catch((e) => console.log(e));
  }, []);

  const handleMenuClick = useCallback(
    async (e, menuId) => {
      e.preventDefault();

      setSelectedMenu({});
      setSelectedMenuImgURL(``);
      selectedMenuIdRef.current = menuId;

      getFood(selectedMenuIdRef.current)
        .then((res) => {
          setSelectedMenu(res.data);
          if (res.data.img_key) {
            setSelectedMenuImgURL(
              `https://foodineye2.s3.ap-northeast-2.amazonaws.com/${res.data.img_key}`
            );
          }
        })
        .catch((e) => console.log(e));
    },
    [selectedMenuIdRef]
  );

  const [menuName, setMenuName] = useState(selectedMenu.name);
  const [menuDesc, setMenuDesc] = useState(selectedMenu.desc);
  const [menuAllergy, setMenuAllergy] = useState(selectedMenu.allergy);
  const [originItems, setOriginItems] = useState(selectedMenu.origin);
  const [menuPrice, setMenuPrice] = useState(selectedMenu.price);

  const [menuImg, setMenuImg] = useState(selectedMenu.img_key);
  const cropperRef = useRef(null);
  const [inputImage, setInputImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleAddNewMenu = (e) => {
    e.preventDefault();

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

        setMenuList([...menuList, newMenu.data]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
        console.log(e);
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

  const handleSaveImgClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    try {
      if (croppedImage.length !== 0) {
        formData.append("file", croppedImage);

        await putFoodImg(`/food/image?id=${selectedMenu._id}`, formData)
          .then((res) => {
            setSelectedMenuImgURL(res.data.img_url);
            setEditMenuImg(false);
            setInputImage(null);
            setCroppedImage(null);
          })
          .catch((e) => {
            if (e.response.status === 503) {
              console.log(e.response.data.detail);
            } else {
              console.log(e);
            }
          });
      } else {
        setEditMenuImg(false);
      }
    } catch (e) {
      console.log(e);
    }
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
              <div className={Menu.title}>
                <h1>Menu</h1>
              </div>
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
                        저장
                      </button>
                    ) : (
                      <button
                        className={Button.modifyImgMenu}
                        onClick={(e) => handleEditImgClick(e)}
                      >
                        수정
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
                <div className={Menu.infoButtons}>
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
