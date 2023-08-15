import styles from "../css/Account.module.css";
import Button from "../css/Button.module.css";
import { getStore } from "../components/API.module";
import { Link, useNavigate } from "react-router-dom";

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
