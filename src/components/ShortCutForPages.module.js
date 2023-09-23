import { useNavigate } from "react-router-dom";
import ShortCut from "../css/ShortCutForPages.module.css";

import mStore from "../images/store.png";
import mOrder from "../images/bill.png";
import mFood from "../images/fast-food-outline.png";
import mMenu from "../images/menu-dots.png";
import dailyReport from "../images/24-hours.png";
import menuAnalysis from "../images/analytics.png";

function ShortCutForPages() {
  const navigate = useNavigate();

  const onClickToStoreManagePage = (e) => {
    e.preventDefault();

    navigate(`/store-manage`);
  };

  const onClickToMenuManagePage = (e) => {
    e.preventDefault();

    navigate(`/menu-manage`);
  };
  const onClickToOrderManagePage = (e) => {
    e.preventDefault();

    navigate(`/order-manage`);
  };
  const onClickToMenuPosRecPage = (e) => {
    e.preventDefault();

    navigate(`/menu-placement`);
  };
  const onClickToAnalysisPage = (e) => {
    e.preventDefault();

    navigate(`/daily-report`);
  };
  const onClickToDetailAnalysisPage = (e) => {
    e.preventDefault();

    navigate(`/menu-analysis`);
  };

  return (
    <div className={ShortCut.body}>
      <span>바로가기 탭</span>
      <section className={ShortCut.icons}>
        <div>
          <button onClick={onClickToStoreManagePage}>
            <img src={mStore} alt="가게 관리 바로가기" />
            <p>가게 관리</p>
          </button>
          <button onClick={onClickToMenuManagePage}>
            <img src={mFood} alt="메뉴 관리 바로가기" />
            <p>메뉴 관리</p>
          </button>
        </div>
        <div>
          <button onClick={onClickToOrderManagePage}>
            <img src={mOrder} alt="주문 관리 바로가기" />
            <p>주문 관리</p>
          </button>
          <button onClick={onClickToMenuPosRecPage}>
            <img src={mMenu} alt="메뉴 배치 바로가기" />
            <p>메뉴 배치</p>
          </button>
        </div>
        <hr className={ShortCut.vertical} />
        <div>
          <button onClick={onClickToAnalysisPage}>
            <img src={dailyReport} alt="데일리 리포트 바로가기" />
            <p>데일리 리포트</p>
          </button>
          <button onClick={onClickToDetailAnalysisPage}>
            <img src={menuAnalysis} alt="메뉴 분석 바로가기" />
            <p>메뉴 분석</p>
          </button>
        </div>
      </section>
    </div>
  );
}

export default ShortCutForPages;
