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

import { getOrders, getFoods, getFood } from "../components/API.module";
import { useState, useEffect } from "react";

function MainPage() {
  // const sID = `641459134443f2168a32357b`; //일식가게 id
  const sID = `641458bd4443f2168a32357a`; //파스타가게 id

  const [value, onChange] = useState(new Date());
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [orderData, setOrderData] = useState([]);

  const [buttonStates, setButtonStates] = useState([]);

  useEffect(() => {
    setLoading(true);

    const orderLists = async () => {
      try {
        const ordersResponse = await getOrders();
        const orders = await ordersResponse.data.response;

        const filteredOrders = orders.filter((order) => order.s_id === sID);

        const foodIds = filteredOrders.map((order) => order.f_list[0].f_id);
        const foodsResponse = await Promise.all(
          foodIds.map((fID) => getFood(fID))
        );
        const foods = await Promise.all(
          foodsResponse.map((res) => res.data.response)
        );

        console.log(filteredOrders);
        const orderListWithFoods = filteredOrders
          .map((order, index) => ({
            ...order,
            foodName: foods[index].name,
          }))
          .map((order, index) => ({
            ...order,
            index: filteredOrders.length - index,
          }));

        setOrderList(orderListWithFoods);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    orderLists();
  }, []);

  // /** 가장 최근 order부터 내림차순 */
  // const mostRecent = orderList.reduce((acc, current) => {
  //   return new Date(current.date) > new Date(acc.date) ? current : acc;
  // }, orderList[0]);

  const handleOrderClick = (order) => {
    setOrderData([]);
    const promises = order.f_list.map((f) => getFoods(order.s_id));

    Promise.all(promises).then((foodLists) => {
      const data = order.f_list.map((f, index) => {
        const foodItem = foodLists[index].data.response.find(
          (item) => item._id === f.f_id
        );
        return {
          menuName: foodItem.name,
          menuCount: f.count,
          menuPrice: foodItem.price * f.count,
        };
      });
      setOrderData(data);
    });
  };

  const handleOrderButtonClick = (index) => {
    setButtonStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = (newStates[index] + 1) % 3; // 0, 1, 2 중 하나의 값을 가짐
      return newStates;
    });
  };

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
                      <li onClick={() => handleOrderClick(order)}>{`${
                        orderList.length - index
                      }. ${
                        order.foodName.length > 5
                          ? order.foodName.substring(0, 5) + "..."
                          : order.foodName
                      }`}</li>
                      <section className={Main.manageBtn}>
                        <button
                          className={Button.getOrder}
                          onClick={() => handleOrderButtonClick(order.index)}
                        >
                          <span>
                            {buttonStates[order.index] === 0 && "접수 대기"}
                            {buttonStates[order.index] === 1 && "수령 대기"}
                            {buttonStates[order.index] === 2 && "완료"}
                          </span>
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
