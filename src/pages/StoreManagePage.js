import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

function StoreManagePage() {
  const [desc, setDesc] = useState("우리 가게는요 수제 버거 전문점으로 ~");
  const [schedule, setSchedule] = useState("11시-20시, 매주 월요일 휴무");
  const [noti, setNoti] = useState(
    "2023년 3월 6일은 가게 사장님 개인사정으로 임시 휴업합니다."
  );
  const [editDescAndSchedule, setEditDescAndSchedule] = useState(false);
  const [editNoti, setEditNoti] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

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

  const handleButtonClick = (btnId) => {
    setActiveBtn(btnId);
  };

  /*   가게 상태 버튼의 상태에 따라 통신
  const renderContent = () => {
    if (activeBtn === 1) {

    }else if (activeBtn === 2) {

    }
  } */

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Store.inner}>
        <section className="status-bar">
          <div className={Store.status}>
            <button
              className={Store.statusButton}
              activeColor="#ff9345"
              onClick={() => handleButtonClick(1)}
            >
              영업 중
            </button>
            <button
              className={Store.statusButton}
              activeColor="#ff9345"
              onClick={() => handleButtonClick(2)}
            >
              영업 종료
            </button>
          </div>
        </section>
        <div className={Store.content}>
          <section className="description">
            <div className={Store.desc}>
              <h1>000 가게</h1>
              <div className={Store.info}>
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

                {editDescAndSchedule ? (
                  //show edit button when editing
                  <button className={Button.modify} onClick={handleSaveClick}>
                    저장
                  </button>
                ) : (
                  //show modify button when not editing
                  <button
                    className={Button.modify}
                    onClick={handleEditDescAndScheduleClick}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </section>
          <section className="notice">
            <div className={Store.notice}>
              <h1>가게 공지사항</h1>
              {editNoti ? (
                <input
                  type="text"
                  value={noti}
                  onChange={(e) => setNoti(e.target.value)}
                />
              ) : (
                <p>{noti}</p>
              )}
              <div className={Store.buttons}>
                {editNoti ? (
                  //show edit button when editing
                  <button className={Button.modify} onClick={handleSaveClick}>
                    저장
                  </button>
                ) : (
                  //show modify button when not editing
                  <button
                    className={Button.modify}
                    onClick={handleEditNotiClick}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default StoreManagePage;
