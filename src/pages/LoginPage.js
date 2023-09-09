import Login from "../css/Login.module.css";
import Button from "../css/Button.module.css";
import { getStore, postLogin } from "../components/API.module";
import { handleError } from "../components/JWT.module";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { startTokenRefresh } from "../components/TokenRefreshService";
import { useAuth } from "../components/AuthContext";

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
  const { login } = useAuth();

  const [showIdErrorMsg, setShowIdErrorMsg] = useState(false);
  const [showPasswdErrorMsg, setShowPasswdErrorMsg] = useState(false);

  const [idInput, setIdInput] = useState("");
  const [passwordInput, setPasswdInput] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const newId = document.querySelector("#id").value;
    const newPasswd = document.querySelector("#password").value;

    const formData = new FormData();
    formData.append("username", newId);
    formData.append("password", newPasswd);

    try {
      const request = await postLogin(`/seller/login`, formData);

      if (request.status === 200) {
        const tokenCreationTime = new Date(request.headers.date).getTime();

        localStorage.setItem("u_id", request.data.u_id);
        localStorage.setItem("s_id", request.data.s_id);
        localStorage.setItem("a_token", request.data.A_Token);
        localStorage.setItem("r_token", request.data.R_Token);
        localStorage.setItem("r_token_create_time", tokenCreationTime);

        startTokenRefresh();
        login();

        if (request.data.s_id) {
          getStoreNum(localStorage.getItem("s_id"));
          navigate("/main");
        } else {
          navigate("/store-setting");
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.detail === "Incorrect PW") {
          setShowPasswdErrorMsg(true);
        } else if (error.response.data.detail === "Nonexistent ID") {
          setShowIdErrorMsg(true);
        }
      } else if (error.response.status === 401) {
        console.log(error.response.data.detail);
        alert("로그인에 실패했습니다. 다시 로그인해주세요.");

        setIdInput("");
        setPasswdInput("");
      } else {
        handleError(error);
      }
    }
  };

  const getStoreNum = async (s_id) => {
    const res = await getStore(s_id);
    localStorage.setItem("storeNum", res.data.num);
  };

  const handleIdChange = (e) => {
    setIdInput(e.target.value);
    setShowIdErrorMsg(false);
  };

  const handlePasswdChange = (e) => {
    setPasswdInput(e.target.value);
    setShowIdErrorMsg(false);
    setShowPasswdErrorMsg(false);
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
                  value={idInput}
                  onChange={handleIdChange}
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
                  value={passwordInput}
                  onChange={handlePasswdChange}
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
