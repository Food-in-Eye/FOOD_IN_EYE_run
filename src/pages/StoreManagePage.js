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
        <section className="description">
          <h1>000 가게</h1>
          <div>
            <ul>
              <h3>가게 한줄 소개</h3>
              <li></li>
            </ul>
            <button className={Button.modify}>수정</button>
          </div>
        </section>
        <section className="notice">
          <div>
            <h3>가게 공지사항</h3>
            <button className={Button.modify}>수정</button>
            <button className={Button.modify}>추가</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StoreManagePage;
