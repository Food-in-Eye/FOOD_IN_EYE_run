import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import { useState, useEffect } from "react";

function StoreManagePage() {
  const [desc, setDesc] = useState("우리 가게는요 수제 버거 전문점으로 ~");
  const [schedule, setSchedule] = useState("11시-20시, 매주 월요일 휴무");
  const [noti, setNoti] = useState(
    "2023년 3월 6일은 가게 사장님 개인사정으로 임시 휴업합니다."
  );
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
