import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Order from "../css/OrderManage.module.css";

function OrderManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Order.inner}>
        <div className={Order.beforeScroll}>
          <section className="current-order-history">
            <div className={Order.currentOrder}>
              <h2>현재 주문 내역(오늘)</h2>
              <ul>
                <li>
                  1. ---- <button>주문 접수중</button>
                </li>
                <li>
                  2. ---- <button>조리 완료</button>
                </li>
              </ul>
            </div>
          </section>
          <hr className={Main.vertical} />
          <section className="order-progress">
            <div className={Order.orderNum}>
              <h2>주문 번호</h2>
              <div className={Order.orders}>
                <section className={Order.progress}>
                  <div className={Order.bind}>
                    <img
                      src={require("../images/order_received.jpeg")}
                      alt="주문 접수 icon"
                    ></img>
                    <p>주문 접수</p>
                  </div>
                  <div className={Order.bind}>
                    <img
                      src={require("../images/cooking.jpeg")}
                      alt="조리 중 icon"
                    ></img>
                    <p>조리 중</p>
                  </div>
                  <div className={Order.bind}>
                    <img
                      src={require("../images/finished_cooking.jpeg")}
                      alt="조리 완료 icon"
                    ></img>
                    <p>조리 완료</p>
                  </div>
                </section>
                <section className={Order.content}>
                  <h3>주문 내역</h3>
                  <div className={Order.menus}>
                    <div className={Order.menu}>
                      <span>
                        <p>더블베이컨치즈버거</p>
                        <p>1</p>
                        <p>+8,700원</p>
                      </span>
                    </div>
                    <div className={Order.menu}>
                      <span>
                        <p>감자튀김L</p>
                        <p>1</p>
                        <p>+2,000원</p>
                      </span>
                    </div>
                    <div className={Order.menu}>
                      <span>
                        <p>코카콜라L</p>
                        <p>1</p>
                        <p>+2,500원</p>
                      </span>
                    </div>
                    <hr className={Order.horizontalHr1} />
                    <div className={Order.totalCount}>13,200원</div>
                    <button className={Order.sendMessage}>
                      수령 메시지 전송하기
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
        <div className={Order.afterScroll}>
          <section className="accumulated-order-history">
            <div className={Order.header}>
              <h2>누적 주문 내역</h2>
              <p>2023.03.06</p>
            </div>
            <div className={Order.histories}>
              <p className={Order.number}>주문번호 : 001108</p>
              <div className={Order.history}>
                <span>
                  <p>메뉴 1, 수량 1개, ~~~~~~~~~~~~~~~~~~~~~~</p>
                  <p>30,000원</p>
                </span>
              </div>
              <hr className={Order.horizontalHr2} />
              <div className={Order.totalHistoryCount}>총 30,000원</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderManagePage;
