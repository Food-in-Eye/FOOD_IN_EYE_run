import { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";

import Main from "../css/Main.module.css";
import Bar from "../css/UnderBar.module.css";
import Button from "../css/Button.module.css";
import MenuBar from "../components/MenuBar";
import Table from "../components/Table.module";
import ShortCuts from "../components/ShortCutForPages.module";

/**import images from ../images/* */
import orderReceive from "../images/order_received.jpeg";
import cooking from "../images/cooking.jpeg";
import finishCook from "../images/finished_cooking.jpeg";
import arrow from "../images/right_arrow.jpeg";

function MainPage() {
  const [value, onChange] = useState(new Date());

  const orderData = [
    {
      menuName: "더블치즈베이컨시그니처",
      menuCount: 2,
      menuPrice: 8000,
    },
    {
      menuName: "감자튀김L",
      menuCount: 1,
      menuPrice: 4500,
    },
    {
      menuName: "코카콜라L",
      menuCount: 2,
      menuPrice: 3000,
    },
    {
      menuName: "치즈스틱",
      menuCount: 2,
      menuPrice: 3000,
    },
  ];

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Main.inner}>
        <div className={Main.rest}>
          <section className={Main.sales}>
            <h3>(어제보다 오늘) +5%</h3>
            <h2>2,000,000원</h2>
            <p>오늘의 총 판매량</p>
          </section>
          <section className={Main.cal}>
            <Calendar onChange={onChange} value={value} />
            <div className="text-gray-500 mt-4">
              {moment(value).format("YYYY년 MM월 DD일")}
            </div>
          </section>
          <section className={Main.shortcut}>
            <ShortCuts />
          </section>
        </div>
        <div className={Main.orderDashboard}>
          <div className={Main.orders}>
            <section className={Main.dashboardBackground} />
            <div className={Main.orderTodays}>
              <h2>현재 주문 내역(오늘)</h2>
              <div className={Bar.line}>
                <div className={Bar.circle}></div>
              </div>
              <ul>
                <hr />
                <li>1. --- </li>
                <section className={Main.manageBtn}>
                  <button className={Button.getOrder}>
                    <span>주문 접수</span>
                  </button>
                </section>
                <hr />
                <li>2. --- </li>
                <hr />
                <li>3. --- </li>
                <hr />
                <li>4. --- </li>
                <hr />
                <li>5. --- </li>
                <hr />
              </ul>
            </div>
          </div>
        </div>
        <div className={Main.orderInfo}>
          <section className={Main.infoHeader}>
            <h2>주문 상세 페이지</h2>
          </section>
          <div className={Main.infoBody}>
            <section className={Main.orderSeq}>
              <div>
                <img src={orderReceive} alt="주문 접수 이미지" />
                <p>주문 접수</p>
              </div>
              <img className={Main.arrow} src={arrow} alt="화살표" />
              <div>
                <img src={cooking} alt="조리 시작 이미지" />
                <p>조리 시작</p>
              </div>
              <img className={Main.arrow} src={arrow} alt="화살표" />
              <div>
                <img src={finishCook} alt="조리 완료 이미지" />
                <p>조리 완료</p>
              </div>
            </section>
            <section className={Main.orderDetail}>
              <h3>주문 내역</h3>
              <div className={Main.orderContents}>
                <Table data={orderData} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
