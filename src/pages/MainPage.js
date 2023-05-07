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

import { getOrders, getFood } from "../components/API.module";
import { useState, useEffect } from "react";

function MainPage() {
  const [value, onChange] = useState(new Date());
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchOrderList = async () => {
      try {
        const ordersResponse = await getOrders();
        const orders = await ordersResponse.data.response;

        const foodIds = orders.map((order) => order.f_list[0].f_id);
        const foodsResponse = await Promise.all(
          foodIds.map((fID) => getFood(fID))
        );
        const foods = await Promise.all(
          foodsResponse.map((res) => res.data.response)
        );

        const orderListWithFoods = orders.map((order, index) => ({
          ...order,
          foodName: foods[index].name,
        }));

        setOrderList(orderListWithFoods).then(setLoading(false));
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderList();
  }, []);

  /** 가장 최근 order부터 내림차순 */
  const mostRecent = orderList.reduce((acc, current) => {
    return new Date(current.date) > new Date(acc.date) ? current : acc;
  }, orderList[0]);

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
                {orderList
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((order, index) => (
                    <div key={index}>
                      <li>{`${orderList.length - index}. ${
                        order.foodName.length > 5
                          ? order.foodName.substring(0, 5) + "..."
                          : order.foodName
                      }`}</li>
                      <section className={Main.manageBtn}>
                        <button className={Button.getOrder}>
                          <span>주문 접수</span>
                        </button>
                      </section>
                      <hr />
                    </div>
                  ))}
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
