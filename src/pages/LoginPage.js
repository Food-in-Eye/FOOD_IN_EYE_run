import styles from "../css/Account.module.css";
import Button from "../css/Button.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const wsUrl = `ws://172.22.0.3:8000/api/v2/websockets/ws`;
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const getTokenAndCheck = async (storeID) => {
    console.log("try to connect websocket");
    try {
      const newSocket = new WebSocket(`${wsUrl}?s_id=${storeID}`);
      // console.log(socket);

      newSocket.onopen = () => {
        // socket.send(`connect`);
        console.log("WebSocket connection established");
      };

      // 웹소켓 연결 에러 발생 시
      newSocket.onerror = (e) => {
        console.log("WebSocket error:", e);
      };

      // 웹소켓 연결 닫힐 경우
      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      // 웹소켓 연결 시 받는 메시지
      newSocket.onmessage = (event) => {
        // const response = JSON.parse(event.data);
        console.log("Received response:", event.data);
      };

      setSocket(newSocket);
    } catch (error) {
      console.log(error);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();

    const storeID = document.querySelector("#storeID").value;
    // console.log(storeID);

    await getTokenAndCheck(storeID);

    // navigate(`/main`);
  };

  return (
    <div className={styles.container}>
      <form>
        <h2>로그인</h2>
        <section className="login-screen">
          <div className={styles.align}>
            <p>ID</p>
            <input id="storeID" type="text" name="id" placeholder="이메일" />
            <p>Password</p>
            <input type="password" name="password" placeholder="비밀번호" />
            <br />
            <button className={Button.style} onClick={onLogin}>
              로그인
            </button>
          </div>
        </section>
        <br />
        <Link to={`/register`} className={styles.link}>
          회원가입
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
