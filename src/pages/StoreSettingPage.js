import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import Button from "../css/Button.module.css";
import StoreSet from "../css/StoreSetting.module.css";
import SelectTime from "../components/SelectTime.module";
import { getStore, postStore } from "../components/API.module";
import { useNavigate } from "react-router-dom";
import useTokenRefresh from "../components/useTokenRefresh";

function StoreSettingPage() {
  useTokenRefresh();
  const navigate = useNavigate();

  const uID = localStorage.getItem("u_id");
  const sID = localStorage.getItem("s_id");
  const [store, setStore] = useState({});

  console.log("store", store);

  const [nameCheck, setNameCheck] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [schedule, setSchedule] = useState("");
  const [notice, setNotice] = useState("");

  const [selectedOpenTime, setSelectedOpenTime] = useState("");
  const [selectedCloseTime, setSelectedCloseTime] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showNameDuplicateMsg, setShowNameDuplicateMsg] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (sID) {
      getStore(sID)
        .then((res) => {
          const data = res.data;
          setStore(data);
          setName(data.name || "");
          setDesc(data.desc || "");
          setSchedule(data.schedule || "");
          setNotice(data.notice || "");
        })
        .catch((error) => console.error(error));
    }
  }, [sID]);

  const handleNameDuplicate = async (e) => {
    e.preventDefault();
    setIsButtonClicked(true);
    try {
      const res = await postStore(`/namecheck`, {
        name: nameCheck,
      });

      if (res.data.state === "available") {
        setShowNameDuplicateMsg(false);
        setName(nameCheck);
      } else if (res.data.state === "unavailable") {
        setIsButtonClicked(false);
        setShowNameDuplicateMsg(true);
      }
    } catch (error) {
      if (error.response.status === 409) {
        console.log(error.response.data.detail);
      } else if (error.response.status === 503) {
        console.log(error.response.data.detail);
      } else {
        console.log("Error checking store name duplicate:", error);
      }
      setIsButtonClicked(false);
    }

    setName(nameCheck);
  };

  // const handleSelectOpenTime = (time) => {
  //   setSelectedOpenTime(time);
  // };

  // const handleSelectCloseTime = (time) => {
  //   setSelectedCloseTime(time);
  // };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
  };

  const updateStoreInfo = async (e) => {
    e.preventDefault();

    const schedule = document.querySelector("#store_schedule").value;
    const desc = document.querySelector("#store_desc").value;
    const notice = document.querySelector("#store_notice").value;

    try {
      const res = await postStore(`/store?u_id=${uID}`, {
        name: name,
        desc: desc,
        schedule: schedule,
        notice: notice,
        status: 1,
      });

      /**가게 대표 이미지 업로드 */
      // const formData = new FormData();
      // if (selectedImage) {
      //   formData.append("image", selectedImage);
      // }

      if (res.status === 200) {
        localStorage.setItem("s_id", res.data.document_id);
        navigate("/main");
      }
    } catch (error) {
      console.log("가게 정보 업데이트 오류", error);
    }
  };

  return (
    <div>
      <MenuBar />
      <div className={StoreSet.background}>
        <div className={StoreSet.body}>
          <section className={StoreSet.desc}>
            <h1>Store Settings</h1>
            <span>필요한 가게의 정보들을 입력하세요</span>
          </section>
          <section className={StoreSet.RegisterForm}>
            <form>
              <div className={StoreSet.storeImageDiv}>
                <span>가게 대표 이미지</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className={StoreSet.storeNameDiv}>
                <span>가게 이름</span>
                <div className={StoreSet.storeNameCheckDiv}>
                  <label htmlFor="store_name">
                    <input
                      id="store_name"
                      type="text"
                      name="store_name"
                      placeholder="Ex)한눈에 학식"
                      value={name}
                      onChange={(e) => {
                        setNameCheck(e.target.value);
                        setShowNameDuplicateMsg(false);
                      }}
                      style={{
                        width: "21vw",
                        border:
                          name &&
                          isButtonClicked &&
                          showNameDuplicateMsg === false &&
                          "2px solid #52bf8b",
                      }}
                    />
                  </label>
                  <button
                    className={Button.nameDuplicateCheck}
                    onClick={handleNameDuplicate}
                  >
                    이름 중복 확인
                  </button>
                </div>
                <div className={StoreSet.showDuplicateMessage}>
                  {nameCheck && isButtonClicked && showNameDuplicateMsg ? (
                    <p style={{ color: "#B9062F" }}>
                      이미 사용 중인 이름 입니다.
                    </p>
                  ) : (
                    nameCheck &&
                    isButtonClicked &&
                    !showNameDuplicateMsg && <p>사용 가능한 이름 입니다.</p>
                  )}
                </div>
              </div>
              <div className={StoreSet.setInfoDiv}>
                {/* <div className={StoreSet.selectTimeDiv}> */}
                <label htmlFor="store_schedule">
                  <span>운영 시간</span>
                  <textarea
                    id="store_schedule"
                    type="text"
                    name="store_schedule"
                    cols="30"
                    rows="2"
                    placeholder="가게의 운영 시간을 설정하세요!"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                  {/* <SelectTime
                  onSelectOpenTime={handleSelectOpenTime}
                  onSelectCloseTime={handleSelectCloseTime}
                /> */}
                </label>
                {/* </div> */}

                <label htmlFor="store_desc">
                  <span>가게 한 줄 소개</span>
                  <textarea
                    id="store_desc"
                    type="text"
                    name="store_desc"
                    cols="30"
                    rows="2"
                    placeholder="가게 한 줄 소개를 작성해보세요!"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </label>
                <label htmlFor="store_notice">
                  <span>가게 공지사항</span>
                  <textarea
                    id="store_notice"
                    type="text"
                    name="store_notice"
                    cols="30"
                    rows="2"
                    placeholder="가게의 공지사항을 적어주세요!"
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                  />
                </label>
              </div>
            </form>
          </section>
          <button className={Button.registerStore} onClick={updateStoreInfo}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreSettingPage;
