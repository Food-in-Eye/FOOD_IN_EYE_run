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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getHistory(sID);
  }, []);

  const getHistory = (sID) => {
    getOrderHistory(`dates?s_id=${sID}`).then((res) => {
      setPageCount(res.data.max_batch);
      console.log(res.data.response);
      setOrderHistoryList(res.data.response);
    });
  };

  /** 정렬을 위한 string->Date */
  const tStringToTime = (tString) => {
    const [hours, minutes, seconds] = tString.split(":");
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  };

  const handleDateRecent = (e) => {
    e.preventDefault();

    if (!isRecentSortClicked) {
      const sortedOrderHistory = [...orderHistory].sort(
        (a, b) => tStringToTime(b["orderTime"]) - tStringToTime(a["orderTime"])
      );
      setOrderHistory(sortedOrderHistory);

      setRecentSortClicked(true);
      setLastSortClicked(false);
    }
  };

  const handleDateLast = (e) => {
    e.preventDefault();

    if (!isLastSortClicked) {
      const sortedOrderHistory = [...orderHistory].sort(
        (a, b) => tStringToTime(a["orderTime"]) - tStringToTime(b["orderTime"])
      );
      setOrderHistory(sortedOrderHistory);
      setRecentSortClicked(false);
      setLastSortClicked(true);
    }
  };

  const fetchOrderDetails = async (date) => {
    const res = await getOrderHistory(`date?s_id=${sID}&date=${date}`);
    const orderDetails = res.data.response;
    const orderData = orderDetails.map((data) => ({
      orderTime: data.date.slice(11, 19),
      // DELETE LATER: 이전 주문 중 f_name이 없는 data를 위한 f_id 남겨놓은 상태
      orderMenus: `${
        data.detail[0].f_name ? data.detail[0].f_name : data.detail[0].f_id
      } ${data.detail[0].count}개`,
      orderPrice: data.detail[0].price * data.detail[0].count,
    }));

    return orderData;
  };

  const handleOrderClick = async (e, date, index) => {
    e.preventDefault();

    const orderData = await fetchOrderDetails(date);
    setOrderHistory(orderData);
    setSelectedOrderIndex(index);

    setRecentSortClicked(true);
    setLastSortClicked(false);
  };

  const handleDateRange = async (e) => {
    e.preventDefault();

    const res = await getOrderHistory(
      `dates?s_id=${sID}&start_date=${startDate}&end_date=${endDate}`
    );
    setOrderHistoryList(res.data.response);
  };

  // console.log("order-history-list", orderHistoryList);

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <section className={Order.body}>
        <div className={Order.historyHead}>
          <h3>누적 주문 내역</h3>
          <form onSubmit={handleDateRange}>
            <label>
              시작일
              <input
                type="date"
                name="dates"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              종료일
              <input
                type="date"
                name="dates"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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
