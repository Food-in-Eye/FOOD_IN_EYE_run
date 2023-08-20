import Login from "../css/Login.module.css";
import Button from "../css/Button.module.css";
import { getStore } from "../components/API.module";
import { Link, useNavigate } from "react-router-dom";

import barChart from "../images/bar-chart.png";
import bidLandscape from "../images/bid-landscape.png";
import bubbleChart from "../images/bubble-chart.png";
import foodBank from "../images/food-bank.png";
import restaurant from "../images/restaurant.png";
import soupKitchen from "../images/soup-kitchen.png";
import trendingDown from "../images/trending-down.png";
import trendingUp from "../images/trending-up.png";
import update from "../images/update.png";
import shoppingCart from "../images/shopping-cart.png";
import calendar from "../images/calendar.png";

function LoginPage() {
  const navigate = useNavigate();
  const onLogin = async (e) => {
    e.preventDefault();

    const storeID = document.querySelector("#storeID").value;
    // storeID를 localStorage에 저장
    localStorage.setItem("storeID", storeID);
    getStore(storeID).then((res) =>
      localStorage.setItem("storeNum", res.data.response.num)
    );

    navigate(`/main`);
  };

  return (
    <div className={Login.container}>
      <section className={Login.backgroundImgs}>
        <img
          src={barChart}
          alt="bar-chart"
          style={{ top: "5%", left: "83%" }}
        />
        <img
          src={bidLandscape}
          alt="bid-landscape"
          style={{ top: "33%", left: "95%" }}
        />
        <img
          src={bubbleChart}
          alt="bubble-chart"
          style={{ top: "73%", left: "63%" }}
        />
        <img
          src={foodBank}
          alt="food-bank"
          style={{ top: "80%", left: "25%" }}
        />
        <img
          src={restaurant}
          alt="restaurant"
          style={{ top: "37%", left: "5%" }}
        />
        <img
          src={soupKitchen}
          alt="soup-kitchen"
          style={{ top: "40%", left: "30%" }}
        />
        <img
          src={trendingDown}
          alt="trending-down"
          style={{ top: "30%", left: "63.5%" }}
        />
        <img
          src={trendingUp}
          alt="trending-up"
          style={{ top: "87%", left: "85%" }}
        />
        <img src={update} alt="update" style={{ top: "15%", left: "17%" }} />
        <img src={calendar} alt="update" style={{ top: "55%", left: "79%" }} />
        <img
          src={shoppingCart}
          alt="update"
          style={{ top: "67%", left: "15%" }}
        />
      </section>
      <section className={Login.LoginForm}>
        <h2>Login</h2>
        <form>
          <label htmlFor="id">
            ID
            <input id="id" type="text" name="id" placeholder="ID" />
          </label>
          <label htmlFor="password">
            비밀번호
            <input type="password" name="password" placeholder="비밀번호" />
          </label>
          <button className={Button.login} onClick={onLogin}>
            로그인
          </button>
          <Link to={`/register`} className={Login.link}>
            회원가입하기
          </Link>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
