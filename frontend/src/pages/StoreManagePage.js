import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import axios from "axios";

import { useState, useEffect } from "react";

function StoreManagePage() {
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [editDescAndSchedule, setEditDescAndSchedule] = useState(false);
  const [editNoti, setEditNoti] = useState(false);

  const [isOpenButtonClicked, setIsOpenButtonClicked] = useState(false);
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);

  useEffect(() => {
    //GET 요청을 보내서 데이터 반영
    const fetchStore = async () => {
      try {
        /**요청 시작 시 error과 store 초기화*/
        setError(null);
        setStore([]);
        //loading 상태는 true로 세팅
        setLoading(true);

        const request = await axios.get(
          "http://nginx:80/api/v1/admin/stores/641458bd4443f2168a32357a"
        );
        setStore(request.data.response);

        if (request.data.response.status === 1) {
          setIsOpenButtonClicked(true);
        } else if (request.data.response.status === 2) {
          setIsCloseButtonClicked(true);
        }
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchStore();
  }, []);

  const [descValue, setDescValue] = useState(store.desc);
  const [scheduleValue, setScheduleValue] = useState(store.schedule);
  const [notiValue, setNotiValue] = useState(store.notice);

  const handleEditDescAndScheduleClick = () => {
    setDescValue(store.desc);
    setScheduleValue(store.schedule);
    setEditDescAndSchedule(true);
  };

  const handleEditNotiClick = () => {
    setNotiValue(store.notice);
    setEditNoti(true);
  };

  const handleDescAndScheduleSaveClick = () => {
    axios
      .put(
        "/api/v1/admin/stores/641458bd4443f2168a32357a",
        JSON.stringify({
          ...store,
          desc: descValue,
          schedule: scheduleValue,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setStore((prevState) => ({
          ...prevState,
          desc: descValue,
          schedule: scheduleValue,
        }));
        setEditDescAndSchedule(false);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const handleNotiSaveClick = () => {
    axios
      .put(
        "/api/v1/admin/stores/641458bd4443f2168a32357a",
        JSON.stringify({
          ...store,
          notice: notiValue,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setStore((prevState) => ({ ...prevState, notice: notiValue }));
        setEditNoti(false);
        return store;
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  //open 버튼 클릭 시
  const handleOpenBtnClick = () => {
    setIsOpenButtonClicked(true);
    setIsCloseButtonClicked(false);

    axios
      .put(
        "/api/v1/admin/stores/641458bd4443f2168a32357a",
        JSON.stringify({
          ...store,
          status: 1,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setStore((prevState) => ({ ...prevState, status: 1 }));
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  //close 버튼 클릭 시
  const handleCloseBtnClick = () => {
    setIsCloseButtonClicked(true);
    setIsOpenButtonClicked(false);
    axios
      .put(
        "/api/v1/admin/stores/641458bd4443f2168a32357a",
        JSON.stringify({
          ...store,
          status: 2,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setStore((prevState) => ({ ...prevState, status: 2 }));
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const openBtnStyle = {
    background: store.status === 1 ? "#ff9345" : "#fff",
  };

  const closeBtnStyle = {
    background: store.status === 2 ? "#ff9345" : "#fff",
  };

  useEffect(() => {}, [store]);

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      {store && (
        <div className={Store.content}>
          <div className={Store.statusBar}>
            <div className={Store.status}>
              <button
                className={Store.statusButton}
                id="open"
                onClick={handleOpenBtnClick}
                style={openBtnStyle}
              >
                영업 중
              </button>
              <button
                className={Store.statusButton}
                id="close"
                onClick={handleCloseBtnClick}
                style={closeBtnStyle}
              >
                영업 종료
              </button>
            </div>
          </div>

          <section className={Store.description}>
            <h1>"{store.name}" 가게</h1>
            <div className={Store.desc}>
              <div className={Store.intro}>
                <h3>가게 한줄 소개</h3>
                {editDescAndSchedule ? (
                  <textarea
                    type="text"
                    value={descValue}
                    cols="true"
                    rows="3"
                    onChange={(e) => setDescValue(e.target.value)}
                  />
                ) : (
                  <p>{store.desc}</p>
                )}
              </div>
              <div className={Store.opentime}>
                <h3>운영시간</h3>
                {editDescAndSchedule ? (
                  <textarea
                    type="text"
                    value={scheduleValue}
                    cols="true"
                    rows="1"
                    onChange={(e) => setScheduleValue(e.target.value)}
                  />
                ) : (
                  <p>{store.schedule}</p>
                )}
              </div>

              {editDescAndSchedule ? (
                //show edit button when editing
                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleDescAndScheduleSaveClick}
                >
                  저장
                </button>
              ) : (
                //show modify button when not editing
                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleEditDescAndScheduleClick}
                >
                  수정
                </button>
              )}
            </div>
          </section>

          <section className={Store.noticeBlock}>
            <h1>가게 공지사항</h1>
            <div className={Store.notice}>
              <div className={Store.innerNotice}>
                {editNoti ? (
                  <textarea
                    type="text"
                    value={notiValue || ""}
                    cols="true"
                    rows="2"
                    onChange={(e) => setNotiValue(e.target.value)}
                  />
                ) : (
                  <p className={Store.noticeInfo}>{store.notice}</p>
                )}
              </div>

              {editNoti ? (
                //show edit button when editing

                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleNotiSaveClick}
                >
                  저장
                </button>
              ) : (
                //show modify button when not editing
                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleEditNotiClick}
                >
                  수정
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default StoreManagePage;
