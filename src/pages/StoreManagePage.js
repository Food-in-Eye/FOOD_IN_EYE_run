import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import { getStore, putStore } from "../components/API.module";

import { useState, useEffect } from "react";

function StoreManagePage() {
  const sID = localStorage.getItem("s_id");

  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(null);

  const [editDescAndSchedule, setEditDescAndSchedule] = useState(false);
  const [editNoti, setEditNoti] = useState(false);

  const [isOpenButtonClicked, setIsOpenButtonClicked] = useState(false);
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setStore([]);
        setLoading(true);

        const request = await getStore(sID);
        console.log(request);
        setStore(request.data.response);

        if (request.data.response.status === 1) {
          setIsOpenButtonClicked(true);
        } else if (request.data.response.status === 2) {
          setIsCloseButtonClicked(true);
        }
      } catch (error) {
        console.log(error);
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
    putStore(sID, {
      ...store,
      desc: descValue,
      schedule: scheduleValue,
    })
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
    putStore(sID, {
      ...store,
      notice: notiValue,
    })
      .then((res) => {
        setStore((prevState) => ({ ...prevState, notice: notiValue }));
        setEditNoti(false);
        return store;
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const handleOpenBtnClick = () => {
    setIsOpenButtonClicked(true);
    setIsCloseButtonClicked(false);
    localStorage.setItem("storeOpen", true);
    localStorage.setItem("storeClosed", false);

    putStore(sID, {
      ...store,
      status: 1,
    })
      .then((res) => {
        setStore((prevState) => ({ ...prevState, status: 1 }));
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const handleCloseBtnClick = () => {
    setIsCloseButtonClicked(true);
    setIsOpenButtonClicked(false);
    localStorage.setItem("storeOpen", false);
    localStorage.setItem("storeClosed", true);

    putStore(sID, {
      ...store,
      status: 2,
    })
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
            <h2>"{store.name}" 가게</h2>
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
                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleDescAndScheduleSaveClick}
                >
                  저장
                </button>
              ) : (
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
            <h2>가게 공지사항</h2>
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
                <button
                  className={`${Button.modify} ${Store.modifyBtn}`}
                  onClick={handleNotiSaveClick}
                >
                  저장
                </button>
              ) : (
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
