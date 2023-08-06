import MenuBar from "../components/MenuBar";
import Order from "../css/OrderManage.module.css";
import Button from "../css/Button.module.css";
import OrdersHistoryTable from "../components/OrderTable.module";
import { getOrderHistory } from "../components/API.module";
import { useEffect, useState } from "react";

function OrderManagePage() {
  const sID = localStorage.getItem("storeID");
  const [pageCount, setPageCount] = useState(0);
  const [orderHistoryList, setOrderHistoryList] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [isRecentSortClicked, setRecentSortClicked] = useState(false);
  const [isLastSortClicked, setLastSortClicked] = useState(false);

  useEffect(() => {
    getHistory(sID);
  }, []);

  const getHistory = (sID) => {
    getOrderHistory(`dates?s_id=${sID}`).then((res) => {
      console.log(res.data.response);
      setPageCount(res.data.max_batch);
      setOrderHistoryList(res.data.response);
    });
  };

  const handleDateRecent = (e) => {
    e.preventDefault();

    const sortedList = [...orderHistoryList].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    setOrderHistoryList(sortedList);
    setRecentSortClicked(true);
    setLastSortClicked(false);
  };

  const handleDateLast = (e) => {
    e.preventDefault();

    const sortedList = [...orderHistoryList].sort(
      (a, b) => new Date(a) - new Date(b)
    );
    setOrderHistoryList(sortedList);
    setRecentSortClicked(false);
    setLastSortClicked(true);
  };

  const handleOrderClick = async (e, date, index) => {
    e.preventDefault();
    setOrderHistory([]);
    console.log(date);

    const res = await getOrderHistory(`date?s_id=${sID}&date=${date}`);
    console.log(res);
    const orderDetails = res.data.response;
    console.log(orderDetails);
    console.log(typeof orderDetails[0].detail.price);
    console.log(typeof orderDetails[0].detail.count);
    const orderData = orderDetails.map((data) => ({
      orderTime: data.date.slice(11, 19),
      orderMenus: data.detail.f_id,
      //TODO: price, count 데이터형 확인 필요
      orderPrice:
        isNaN(data.detail.price) || isNaN(data.detail.count)
          ? 0
          : data.detail.price * data.detail.count,
    }));

    setOrderHistory((prevOrderHistory) => [...prevOrderHistory, ...orderData]);
    setSelectedOrderIndex(index);
  };

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
          <div className={Order.historyBodyTop}>
            <section className={Order.sortButtons}>
              <button
                onClick={handleDateRecent}
                className={
                  isRecentSortClicked
                    ? Button.activeSortBtn
                    : Button.inactiveSortBtn
                }
              >
                최신순
              </button>
              <button
                onClick={handleDateLast}
                className={
                  isLastSortClicked
                    ? Button.activeSortBtn
                    : Button.inactiveSortBtn
                }
              >
                날짜순
              </button>
            </section>
          </div>
          <div className={Order.historyBodyBottom}>
            <section className={Order.leftHBody}>
              <ul>
                {orderHistoryList.map((date, index) => (
                  <li
                    key={`order_${index}`}
                    onClick={(e) => handleOrderClick(e, date, index)}
                    className={
                      selectedOrderIndex === index ? Order.selectedOrder : null
                    }
                  >
                    <span>{date}</span>
                    <span>총 가격</span>
                  </li>
                ))}
              </ul>
              <div className={Order.verticalLine}></div>
            </section>
            <section className={Order.rightHBody}>
              <OrdersHistoryTable data={orderHistory} />
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderManagePage;
