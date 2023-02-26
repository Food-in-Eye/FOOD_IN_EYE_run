import { useNavigate } from "react-router-dom";
import Main from "../css/Main.module.css";

function MainPage() {
  const navigate = useNavigate();
  const onClickToManagePage = (e) => {
    e.preventDefault();
    navigate(`./manage`);
  };
  const onClickToAnalysisPage = (e) => {
    e.preventDefault();
    navigate(`./analysis`);
  };

  return (
    <div className={Main.inner}>
      <section className={Main.header}>
        <h2>LOGO</h2>
        <ul className={Main.gnb}>
          <li>
            <a href="./main">Home</a>
          </li>
          <li>
            <a href="./manage">관리</a>
          </li>
          <li>
            <a href="./analysis">분석</a>
          </li>
          <li>
            <a href="./admin">설정</a>
          </li>
        </ul>

        <ul className={Main.util}>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>

        <div className={Main.profile}>
          <img
            src={require("../images/profile.jpeg")}
            alt="프로필 이미지"
          ></img>
          <h3>00가게</h3>
        </div>
      </section>

      <section className={Main.container}>
        <div className={Main.saleAndCal}>
          <div className={Main.sale}>
            <div className={Main.sales}>
              <h2>3,000,000원</h2>
              <h3 className="saleAmount">오늘의 총 판매량</h3>
            </div>
            <h3 className="saleTrend">+5%(판매량 추이)</h3>
          </div>
          <p>캘린더-오늘 날짜 알려주기</p>
        </div>

        <div className={Main.order}>
          <h2>현재 주문 현황</h2>
          <ol>
            <li>
              쉬림프와사비버거 <button>주문 접수중</button>
            </li>
            <li>
              더블치즈베이컨버거<button>조리완료 및 수령대기</button>
            </li>
          </ol>
        </div>
        <div className={Main.pages}>
          <div className={Main.manage}>
            <h2>관리 페이지</h2>
            <button onClick={onClickToManagePage}>View more</button>
          </div>
          <div className={Main.analysis}>
            <h2>분석 페이지</h2>
            <button onClick={onClickToAnalysisPage}>View more</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
