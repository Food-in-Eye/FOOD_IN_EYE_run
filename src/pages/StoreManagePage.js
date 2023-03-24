import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import axios from "axios";

import { useState, useEffect } from "react";

function StoreManagePage() {
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [editDescAndSchedule, setEditDescAndSchedule] = useState(false);
  const [editNoti, setEditNoti] = useState(false);

  const [openButtonDisabled, setOpenButtonDisabled] = useState(true);
  const [closeButtonDisabled, setCloseButtonDisabled] = useState(false);

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
          "/api/v1/admin/stores/641458bd4443f2168a32357a"
        );
        setStore(request.data.response);

        if (request.data.response.status === 1) {
          console.log("영업 중");
          setOpenButtonDisabled(false);
          setCloseButtonDisabled(true);
        } else if (request.data.response.status === 2) {
          console.log("영업 종료");
          setOpenButtonDisabled(true);
          setCloseButtonDisabled(false);
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
  const [notiValue, setNotiValue] = useState(store.noti);

  const handleEditDescAndScheduleClick = () => {
    setEditDescAndSchedule(true);
    setDescValue(store.desc);
    setScheduleValue(store.schedule);
  };

  const handleEditNotiClick = () => {
    setEditNoti(true);
    setNotiValue(store.noti);
  };

  const handleDescAndScheduleSaveClick = () => {
    axios
      .put(
        "/api/v1/admin/stores/641458bd4443f2168a32357a",
        JSON.stringify({
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
        console.log("desc, schedule 데이터 수정");
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
          noti: notiValue,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("noti 데이터 수정");
        setEditNoti(false);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  //open 버튼 클릭 시
  const handleOpenBtnClick = () => {
    if (openButtonDisabled && !closeButtonDisabled) {
      console.log("영업 중으로 변경");
      axios
        .put("/api/v1/admin/stores/641458bd4443f2168a32357a", {
          status: 1,
        })
        .then((res) => {
          console.log("status 1로 수정");
        });
      setOpenButtonDisabled(false);
      setCloseButtonDisabled(true);
    }
  };

  //close 버튼 클릭 시
  const handleCloseBtnClick = () => {
    if (closeButtonDisabled && !openButtonDisabled) {
      console.log("영업 종료로 변경");
      axios
        .put("/api/v1/admin/stores/641458bd4443f2168a32357a", {
          status: 2,
        })
        .then((res) => {
          console.log("status 2로 수정");
        });
      setOpenButtonDisabled(true);
      setCloseButtonDisabled(false);
    }
  };

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
                disabled={openButtonDisabled}
              >
                영업 중
              </button>
              <button
                className={Store.statusButton}
                id="close"
                onClick={handleCloseBtnClick}
                disabled={closeButtonDisabled}
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
                  <input
                    type="text"
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                  />
                ) : (
                  <p>{store.desc}</p>
                )}
              </div>
              <div className={Store.opentime}>
                <h3>운영시간</h3>
                {editDescAndSchedule ? (
                  <input
                    type="text"
                    value={scheduleValue}
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
                  <input
                    type="text"
                    value={notiValue}
                    onChange={(e) => setNotiValue(e.target.value)}
                  />
                ) : (
                  <p>{store.noti}</p>
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
