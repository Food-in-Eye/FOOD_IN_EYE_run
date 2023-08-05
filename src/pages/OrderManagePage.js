import MenuBar from "../components/MenuBar";
import Order from "../css/OrderManage.module.css";
import Button from "../css/Button.module.css";
import OrderTable from "../components/OrderTable.module";

function OrderManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <section className={Order.body}>
        <div className={Order.historyHead}>
          <h3>누적 주문 내역</h3>
          <form action="">
            <label>
              시작일
              <input type="date" name="dates" id="startDate" />
            </label>
            <label>
              종료일
              <input type="date" name="dates" id="endDate" />
            </label>
            <input type="submit" value="조회" className={Button.checkDate} />
          </form>
        </div>
        <div className={Order.historyBody}>
          <section className={Order.sortButtons}>
            <button>최신순</button>
            <button>날짜순</button>
          </section>
          <section className={Order.leftHBody}>
            <ul>
              <li>
                <span>날짜</span>
                <span>총 가격</span>
              </li>
            </ul>
          </section>
          <section className={Order.rightHBody}>{/* <OrderTable /> */}</section>
        </div>
      </section>
    </div>
  );
}

export default OrderManagePage;
