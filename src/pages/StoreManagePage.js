import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";
import Button from "../css/Button.module.css";

function StoreManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Store.inner}>
        <section className="status-bar">
          <div className={Store.status}>
            <button>영업 중</button>
            <button>영업 종료</button>
          </div>
        </section>
        <div className={Store.content}>
          <section className="description">
            <div className={Store.desc}>
              <h1>000 가게</h1>
              <div className={Store.info}>
                <h3>가게 한줄 소개</h3>
                <p>우리 가게는요 수제 버거 전문점으로 ~</p>
                <h3>운영시간</h3>
                <p>오전 11시-20시, 매주 월요일 휴무</p>
                <button className={Button.modify}>수정</button>
              </div>
            </div>
          </section>
          <section className="notice">
            <div className={Store.notice}>
              <h1>가게 공지사항</h1>
              <p>2023년 3월 6일은 가게 사장님 개인사정으로 임시 휴업합니다.</p>
              <div className={Store.buttons}>
                <button className={Button.modify}>수정</button>
                <button className={Button.modify}>추가</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default StoreManagePage;
