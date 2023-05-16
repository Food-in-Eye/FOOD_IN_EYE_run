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
import orderReceive from "../images/order_received.png";
import activeOrderReceive from "../images/active_order_received.png";
import cooking from "../images/cooking.png";
import activeCooking from "../images/active_cooking.png";
import serve from "../images/serve.png";
import activeServe from "../images/active_serve.png";
import arrow from "../images/right_arrow.jpeg";

import {
  getOrders,
  getFoods,
  getFood,
  putOrderStatus,
} from "../components/API.module";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../components/SocketContext.module";
import { SocketProvider } from "../components/SocketContext.module";

function MainPage() {
  const sID = localStorage.getItem("storeID");
  const { socketResponse } = useContext(SocketContext);

  const ordersQuery = `?s_id=${sID}&today=true&asc=false&asc_by=date`;
  const [value, onChange] = useState(new Date());
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (socketResponse) {
      if (
        socketResponse.type === "create_order" &&
        socketResponse.result === "success"
      ) {
        // 주문 현황을 처리하는 로직
        getUpdateOrders();
      }
    }
  }, [socketResponse]);

  const getUpdateOrders = () => {
    setLoading(true);

    const orderLists = async () => {
      try {
        const ordersResponse = await getOrders(ordersQuery);
        const orders = await ordersResponse.data.response;
        const foodIds = orders.map((order) => order.f_list[0].f_id);
        const foodsResponse = await Promise.all(
          foodIds.map((fID) => getFood(fID))
        );
        const foods = await Promise.all(
          foodsResponse.map((res) => res.data.response)
        );

        const orderListWithFoods = orders
          .filter((order, index) => foods[index])
          .map((order, index) => ({
            ...order,
            foodName: foods[index].name,
          }));

        setOrderList(orderListWithFoods);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    orderLists();
  };

  /**order 클릭 시 상세 페이지에 출력 */
  const handleOrderClick = (order) => {
    setOrderData([]);
    console.log("status: ", order.status);

    const promises = order.f_list.map((f) => getFoods(order.s_id));

    Promise.all(promises)
      .then((foodLists) => {
        const data = order.f_list.map((f, index) => {
          const foodItem = foodLists[index].data.response.find(
            (item) => item._id === f.f_id
          );
          return {
            menuName: foodItem.name,
            menuCount: f.count,
            menuPrice: foodItem.price,
            menuPrices: foodItem.price * f.count,
          };
        });
        setOrderData(data);
        return order.status;
      })
      .then((status) => {
        handleImgStyle(status);
      });
  };

  /**order 진행 상황 버튼 클릭 이벤트 */
  const handleOrderButtonClick = async (index) => {
    const newOrders = [...orderList];

    if (newOrders[index].status === 0) {
      newOrders[index].status = 1;
    } else if (newOrders[index].status === 1) {
      newOrders[index].status = 2;
    }
    // 완료 시 더이상 버튼 못누르게 비활성화나 warning 메시지 띄우기

    /**바뀐 진행 상황 PUT */
    try {
      await putOrderStatus(newOrders[index]._id);
    } catch (error) {
      console.log(error);
    }

    setOrderList(newOrders);

    // 업데이트가 완료된 후에 handleDivStyle 호출
    setTimeout(() => {
      handleImgStyle(newOrders[index].status);
    }, 0);
  };

  const handleImgStyle = (status) => {
    const sectionElement = document.getElementById("orderSeq");
    const imgElements = Array.from(sectionElement.querySelectorAll("img"));

    imgElements.forEach((imgElement, index) => {
      if (index % 2 === 0) {
        // 홀수 번째 이미지 (상태 이미지)
        if (index / 2 === status) {
          if (status === 0) {
            imgElement.src = activeOrderReceive;
          } else if (status === 1) {
            imgElement.src = activeCooking;
          } else if (status === 2) {
            imgElement.src = activeServe;
          }

          imgElement.classList.add("active");
        } else {
          if (index === 0) {
            imgElement.src = orderReceive;
          } else if (index === 2) {
            imgElement.src = cooking;
          } else if (index === 4) {
            imgElement.src = serve;
          }

          imgElement.classList.remove("active");
        }
      }
    });
  };

  return (
    <SocketProvider>
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
                <div className={Main.orderTodaysHeader}>
                  <h2>현재 주문 내역(오늘)</h2>
                  <div className={Bar.line}>
                    <div className={Bar.circle}></div>
                  </div>
                </div>
                <ul>
                  <hr />
                  {orderList &&
                    orderList.map((order, index) => (
                      <div key={index}>
                        <div>
                          <li onClick={() => handleOrderClick(order)}>{`${
                            orderList.length - index
                          }. ${
                            order.foodName.length > 8
                              ? order.foodName.substring(0, 8) + "..."
                              : order.foodName
                          }`}</li>
                          <section className={Main.manageBtn}>
                            <button
                              className={Button.getOrder}
                              onClick={() => handleOrderButtonClick(index)}
                            >
                              <span>
                                {order.status === 0 && "접수 대기"}
                                {order.status === 1 && "조리 중"}
                                {order.status === 2 && "완료"}
                              </span>
                            </button>
                          </section>
                        </div>
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
              <section id="orderSeq" className={Main.orderSeq}>
                <div>
                  <img src={orderReceive} alt="주문 접수 이미지" />
                  <p>주문 접수</p>
                </div>
                <img className={Main.arrow} src={arrow} alt="화살표" />
                <div>
                  <img src={cooking} alt="조리 시작 이미지" />
                  <p>조리 중</p>
                </div>
                <img className={Main.arrow} src={arrow} alt="화살표" />
                <div>
                  <img src={serve} alt="수령 대기 이미지" />
                  <p>수령 대기</p>
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
    </SocketProvider>
  );
}

export default MainPage;
