import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Account.module.css";
import Button from "../css/Button.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    navigate(`/main`);
  };

  return (
    <div className={styles.container}>
      <form>
        <h2>로그인</h2>
        <div className={styles.align}>
          <p>ID</p>
          <input type="text" name="id" placeholder="아이디" />
          <p>Password</p>
          <input type="password" name="password" placeholder="비밀번호" />
          <br />
          <button className={Button.style} onClick={onLogin}>
            로그인
          </button>
        </div>
        <br />
        <Link to={`/register`}>회원가입</Link>
      </form>
    </div>
  );
}

export default LoginPage;
