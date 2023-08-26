import Login from "../css/Login.module.css";
import Button from "../css/Button.module.css";
import { getStore, postLogin } from "../components/API.module";
import {
  handleAccessToken,
  handleRefreshToken,
} from "../components/JWT.module";
import RefreshToken from "../components/RefreshToken.module";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { setRefreshToken } from "../storage/Cookie";
import { SET_TOKEN, TOKEN_TIME_OUT } from "../store/Auth";

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

// export let USER_DATA = {};

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const request = await postLogin(`/seller/login`, formData);
      console.log("request", request);
      if (request.status === 200) {
        const tokenCreationTime = new Date(request.headers.date).getTime();

        const user_data = {
          u_id: request.data.u_id,
          a_token: request.data.A_Token,
          r_token: request.data.R_Token,
          a_create_date: tokenCreationTime,
          r_create_date: tokenCreationTime,
        };
        // console.log("USER_DATA", USER_DATA);
        // await RefreshToken({
        //   u_id: request.data.u_id,
        //   a_token: request.data.A_Token,
        //   r_token: request.data.R_Token,
        //   a_create_date: tokenCreationTime,
        //   r_create_date: tokenCreationTime,
        // });
        startTokenRefresh(user_data);

        if (request.data.s_id) {
          getStoreID(request.data.s_id);
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
        console.log(error);
      }
    }
  };

  /** 10초마다 refreshToken 재발급 + accessToken 만료 시 재발급 함수 호출 */
  const startTokenRefresh = (userData) => {
    try {
      setInterval(async () => {
        const currentTime = new Date().getTime();
        const accessTokenExpireTime = userData.a_create_date + TOKEN_TIME_OUT;

        console.log("accessTokenExpireTime", accessTokenExpireTime);
        if (accessTokenExpireTime <= currentTime) {
          const data = await handleAccessToken(userData);
          console.log("data newAToken", data.a_token);
          dispatch(SET_TOKEN(data.a_token, data.a_create_date));
        }
        const data = await handleRefreshToken(userData);
        console.log("data", data);
        console.log("data newRToken", data.r_token);
        setRefreshToken(data.r_token, data.r_create_date);
        // dispatch(SET_TOKEN(data.a_token, data.a_create_date));
      }, 10000);
    } catch (error) {
      console.log("Error Refreshing Tokens:", error);
    }
  };

  const getStoreID = async (s_id) => {
    console.log("s_id", s_id);
    localStorage.setItem("storeID", s_id);
    await getStore(s_id).then((res) =>
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
