import { useNavigate } from "react-router-dom";
import Main from "../css/Main.module.css";
import MenuBar from "../components/MenuBar";

function MainPage() {
  const navigate = useNavigate();

  const onClickToAdminManagePage = (e) => {
    e.preventDefault();
    navigate(`/store-manage`);
  };
  const onClickToMenuManagePage = (e) => {
    e.preventDefault();
    navigate(`/menu-manage`);
  };

  const onClickToMenuPosRecPage = (e) => {
    e.preventDefault();
    navigate(`/menu-position`);
  };

  const onClickToOrderManagePage = (e) => {
    e.preventDefault();
    navigate(`/order-manage`);
  };

  const onClickToAnalysisPage = (e) => {
    e.preventDefault();
    navigate(`/analysis`);
  };
  const onClickToDetailAnalysisPage = (e) => {
    e.preventDefault();
    navigate(`/analysis-detail`);
  };

  return (
    <div className={Main.inner}>
      <MenuBar />
      <section className={Main.sub_page}>
        <div className={Main.saleAndCal}>
          <div className={Main.sale}>
            <div className={Main.sales}>
              <h2>3,000,000원</h2>
              <h3 className="saleAmount">오늘의 총 판매량</h3>
            </div>
            <h3 className="saleTrend">+5%(판매량 추이)</h3>
          </div>
          <p>
            캘린더 <br />- 오늘 날짜 알려주기
          </p>
        </div>

        <div className={Main.order}>
          <h2>현재 주문 현황</h2>
          <hr />
          <ul className={Main.mList}>
            <li>
              쉬림프와사비버거 <button>주문 접수중</button>
            </li>
            <li>
              더블치즈베이컨버거<button>조리완료 및 수령대기</button>
            </li>
          </ul>
        </div>
        <hr className={Main.vertical} />
        <div className={Main.pages}>
          <div className={Main.manage}>
            <h2>관리 페이지</h2>
            <div className={Main.Btn}>
              <button onClick={onClickToAdminManagePage} className={Main.mBtn}>
                가게 관리
              </button>
              <div className={Main.mBtnByCol}>
                <button
                  onClick={onClickToMenuManagePage}
                  className={Main.mBtnMenu}
                >
                  메뉴 관리
                </button>
                <button
                  onClick={onClickToMenuPosRecPage}
                  className={Main.mBtnMenuLoc}
                >
                  메뉴판 배치
                </button>
                <button
                  onClick={onClickToOrderManagePage}
                  className={Main.mBtnOrder}
                >
                  주문 관리
                </button>
              </div>
            </div>
          </div>
          <div className={Main.analysis}>
            <h2>분석 페이지</h2>
            <div className={Main.aBtnByCol}>
              <button
                onClick={onClickToAnalysisPage}
                className={Main.aBtnTotal}
              >
                전체 메뉴분석
              </button>
              <button
                onClick={onClickToDetailAnalysisPage}
                className={Main.aBtnDetail}
              >
                메뉴별 분석
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
