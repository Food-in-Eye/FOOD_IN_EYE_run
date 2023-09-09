import { useState } from "react";
import MenuBar from "../components/MenuBar";
import Button from "../css/Button.module.css";
import StoreSet from "../css/StoreSetting.module.css";
import SelectTime from "../components/SelectTime.module";
import { postStore } from "../components/API.module";
import { useNavigate } from "react-router-dom";
import useTokenRefresh from "../components/useTokenRefresh";

function StoreSettingPage() {
  useTokenRefresh();
  const navigate = useNavigate();

  const uID = localStorage.getItem("u_id");

  const [nameCheck, setNameCheck] = useState("");
  const [name, setName] = useState("");
  const [selectedOpenTime, setSelectedOpenTime] = useState("");
  const [selectedCloseTime, setSelectedCloseTime] = useState("");

  const [showNameDuplicateMsg, setShowNameDuplicateMsg] = useState(false);

  const handleNameDuplicate = async (e) => {
    e.preventDefault();
    try {
      const res = await postStore(`/namecheck`, {
        name: nameCheck,
      });

      if (res.data.state === "available") {
        setShowNameDuplicateMsg(false);
        setName(nameCheck);
      } else if (res.data.state === "unavailable") {
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
    }

    setName(nameCheck);
  };

  const handleSelectOpenTime = (time) => {
    setSelectedOpenTime(time);
  };

  const handleSelectCloseTime = (time) => {
    setSelectedCloseTime(time);
  };

  const onRegister = async (e) => {
    e.preventDefault();

    const desc = document.querySelector("#store_desc").value;
    const notice = document.querySelector("#store_notice").value;

    try {
      const res = await postStore(`/store?u_id=${uID}`, {
        name: name,
        desc: desc,
        schedule: `${selectedOpenTime} - ${selectedCloseTime}`,
        notice: notice,
        status: 1,
      });

      if (res.status === 200) {
        localStorage.setItem("s_id", res.data.document_id);
        navigate("/main");
      }
    } catch (error) {
      console.log(error);
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
              <section className={StoreSet.storeNameSection}>
                <label htmlFor="store_name">
                  <span>가게 이름</span>
                  <input
                    id="store_name"
                    type="text"
                    name="store_name"
                    placeholder="Ex)한눈에 학식"
                    onChange={(e) => {
                      setNameCheck(e.target.value);
                      setShowNameDuplicateMsg(false);
                    }}
                    style={{
                      width: "21vw",
                      border:
                        name &&
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
              </section>
              {nameCheck && showNameDuplicateMsg && (
                <p style={{ color: "#B9062F" }}>이미 사용 중인 이름 입니다.</p>
              )}
              <div className={StoreSet.selectTimeDiv}>
                <span>운영 시간</span>
                <SelectTime
                  onSelectOpenTime={handleSelectOpenTime}
                  onSelectCloseTime={handleSelectCloseTime}
                />
              </div>
              <label htmlFor="store_desc">
                <span>가게 한 줄 소개</span>
                <textarea
                  id="store_desc"
                  type="text"
                  name="store_desc"
                  cols="30"
                  rows="2"
                  placeholder="가게 한 줄 소개를 작성해보세요!"
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
                />
              </label>
            </form>
          </section>
          <button className={Button.registerStore} onClick={onRegister}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreSettingPage;
