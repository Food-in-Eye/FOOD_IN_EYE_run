import { useNavigate } from "react-router-dom";

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
    <div>
      <nav className="navBars">
        <a href="./main">Home</a>
        <a href="./manage">관리</a>
        <a href="./analysis">분석</a>
        <a href="./admin">설정</a>
      </nav>
      <article class="adminProfile">
        <img src={require("../images/profile.jpeg")} alt="프로필 이미지"></img>
        <h3>00가게</h3>
      </article>
      <section>
        <h2>3,000,000원</h2>
        <h3>오늘의 총 판매량</h3>
        <h3>+5%(판매량 추이)</h3>
      </section>
      <section>
        <p>캘린더-오늘 날짜 알려주기</p>
      </section>
      <form>
        <h2>현재 주문 현황</h2>
        <ol>
          <li>
            쉬림프와사비버거 <button>주문 접수중</button>
          </li>
          <li>
            더블치즈베이컨버거<button>조리완료 및 수령대기</button>
          </li>
        </ol>
      </form>
      <form>
        <h2>관리 페이지</h2>
        <button onClick={onClickToManagePage}>View more</button>
      </form>
      <form>
        <h2>분석 페이지</h2>
        <button onClick={onClickToAnalysisPage}>View more</button>
      </form>
    </div>
  );
}

export default MainPage;
