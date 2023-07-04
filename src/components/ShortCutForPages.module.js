import { useNavigate } from "react-router-dom";
import ShortCut from "../css/ShortCutForPages.module.css";

import mBills from "../images/manage_bills.jpeg";
import mFoods from "../images/manage_food.jpeg";
import mMenuLoc from "../images/manage_menu_location.jpeg";
import mStore from "../images/manage_store.jpeg";
import aTotal from "../images/analyze_all.jpeg";
import aMenus from "../images/analyze_menu.jpeg";

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

    navigate(`/analysis`);
  };
  const onClickToDetailAnalysisPage = (e) => {
    e.preventDefault();

    navigate(`/analysis-detail`);
  };

  return (
    <div className={ShortCut.body}>
      <h3>바로가기 탭</h3>
      <section className={ShortCut.icons}>
        <div>
          <button onClick={onClickToStoreManagePage}>
            <img src={mStore} alt="가게 관리 바로가기" />
            <p>가게 관리</p>
          </button>
          <button onClick={onClickToMenuManagePage}>
            <img src={mFoods} alt="메뉴 관리 바로가기" />
            <p>메뉴 관리</p>
          </button>
        </div>
        <div>
          <button onClick={onClickToOrderManagePage}>
            <img src={mBills} alt="주문 관리 바로가기" />
            <p>주문 관리</p>
          </button>
          <button onClick={onClickToMenuPosRecPage}>
            <img src={mMenuLoc} alt="메뉴 배치 바로가기" />
            <p>메뉴 배치</p>
          </button>
        </div>
        <hr className={ShortCut.vertical} />
        <div>
          <button onClick={onClickToAnalysisPage}>
            <img src={aTotal} alt="전체 분석 바로가기" />
            <p>전체 분석</p>
          </button>
          <button onClick={onClickToDetailAnalysisPage}>
            <img src={aMenus} alt="메뉴 분석 바로가기" />
            <p>메뉴 분석</p>
          </button>
        </div>
      </section>
    </div>
  );
}

export default ShortCutForPages;
