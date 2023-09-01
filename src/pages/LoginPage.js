import Login from "../css/Login.module.css";
import Button from "../css/Button.module.css";
import { getStore, postLogin } from "../components/API.module";
import { handleRefreshToken, handleError } from "../components/JWT.module";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const [showIdErrorMsg, setShowIdErrorMsg] = useState(false);
  const [showPasswdErrorMsg, setShowPasswdErrorMsg] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    const newId = document.querySelector("#id").value;
    const newPasswd = document.querySelector("#password").value;

    const formData = new FormData();
    formData.append("username", newId);
    formData.append("password", newPasswd);

    try {
      console.log(
        "formData",
        formData.get("username"),
        formData.get("password")
      );
      const request = await postLogin(`/seller/login`, formData);
      console.log("request", request);
      if (request.status === 200) {
        localStorage.setItem("u_id", request.data.u_id);
        localStorage.setItem("s_id", request.data.s_id);
        localStorage.setItem("a_token", request.data.A_Token);
        localStorage.setItem("r_token", request.data.R_Token);

        console.log("loginpage a_token", localStorage.getItem("a_token"));
        console.log("loginpage r_token", localStorage.getItem("r_token"));
        handleRefreshToken();

        if (request.data.s_id) {
          navigate("/main");
        } else {
          // 가게 초기 설정 화면으로 이동
          navigate("/store-setting");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.detail === "Incorrect PW") {
          setShowPasswdErrorMsg(true);
        } else if (error.response.data.detail === "Nonexistent ID") {
          setShowIdErrorMsg(true);
        }
      } else {
        handleError(error);
      }
    }
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
          <div className={Login.firstSection}>
            <section className={Login.IDSection}>
              <label htmlFor="id">
                아이디
                <input
                  id="id"
                  type="text"
                  name="id"
                  placeholder="아이디"
                  onChange={() => setShowIdErrorMsg(false)}
                />
              </label>
            </section>
            {showIdErrorMsg && <p>존재하지 않는 ID입니다.</p>}
          </div>
          <div className={Login.secondSection}>
            <section className={Login.PasswdSection}>
              <label htmlFor="password">
                비밀번호
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  onChange={() => {
                    setShowPasswdErrorMsg(false);
                    setShowIdErrorMsg(false);
                  }}
                />
              </label>
            </section>
            {showPasswdErrorMsg && (
              <p>ID와 맞지 않는 비밀번호 입니다. 다시 입력해주세요.</p>
            )}
          </div>
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
