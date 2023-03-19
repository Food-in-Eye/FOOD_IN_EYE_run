import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import axios from "axios";

import { useState, useEffect } from "react";

function StoreManagePage() {
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [desc, setDesc] = useState("");
  const [schedule, setSchedule] = useState("");
  const [noti, setNoti] = useState("");
  const [editDescAndSchedule, setEditDescAndSchedule] = useState(false);
  const [editNoti, setEditNoti] = useState(false);

  const handleEditDescAndScheduleClick = () => {
    setEditDescAndSchedule(true);
  };

  const handleEditNotiClick = () => {
    setEditNoti(true);
  };

  const handleSaveClick = () => {
    setEditDescAndSchedule(false);
    setEditNoti(false);
  };

  /*상태바 변경*/
  const [currentClick, setCurrentClick] = useState(null);
  const [prevClick, setPrevClick] = useState(null);

  const onClickBtn = (e) => {
    setCurrentClick(e.target.id);
  };

  useEffect(
    (e) => {
      if (currentClick !== null) {
        let current = document.getElementById(currentClick);
        current.style.backgroundColor = "#ff9345";
      }

      if (prevClick !== null) {
        let prev = document.getElementById(prevClick);
        prev.style.backgroundColor = "#ffffff";
      }
      setPrevClick(currentClick);
    },
    [currentClick]
  );

  useEffect(() => {
    const fetchStore = async () => {
      try {
        /**요청 시작 시 error과 store 초기화*/
        setError(null);
        setStore(null);
        //loading 상태는 true로 세팅
        setLoading(true);

        const request = axios
          .get("/api/v1/admin/store/641458bd4443f2168a32357a")
          // .then((res) => console.log(1, res.data.response))
          .then((res) => setStore(res.data.response));
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchStore();
  }, []);

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Store.content}>
        <div className={Store.statusBar}>
          <div className={Store.status}>
            <button
              className={Store.statusButton}
              id="open"
              onClick={onClickBtn}
            >
              영업 중
            </button>
            <button
              className={Store.statusButton}
              id="close"
              onClick={onClickBtn}
            >
              영업 종료
            </button>
          </div>
        </div>

        <section className={Store.description}>
          <h1>000 가게</h1>
          <div className={Store.desc}>
            <div className={Store.intro}>
              <h3>가게 한줄 소개</h3>
              {editDescAndSchedule ? (
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              ) : (
                <p>{desc}</p>
              )}
            </div>
            <div className={Store.opentime}>
              <h3>운영시간</h3>
              {editDescAndSchedule ? (
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />
              ) : (
                <p>{schedule}</p>
              )}
            </div>

            {editDescAndSchedule ? (
              //show edit button when editing
              <button
                className={`${Button.modify} ${Store.modifyBtn}`}
                onClick={handleSaveClick}
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
                  value={noti}
                  onChange={(e) => setNoti(e.target.value)}
                />
              ) : (
                <p>{noti}</p>
              )}
            </div>
            {editNoti ? (
              //show edit button when editing
              <button
                className={`${Button.modify} ${Store.modifyBtn}`}
                onClick={handleSaveClick}
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
    </div>
  );
}

export default StoreManagePage;
