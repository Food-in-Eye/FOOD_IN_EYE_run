import { useNavigate } from "react-router-dom";
import styles from "../css/Account.module.css";
import Button from "../css/Button.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const onAfterRegister = (e) => {
    navigate(`/`);
  };
  return (
    <div className={styles.container}>
      <form>
        <h2>회원가입</h2>
        <br />
        <section className="register-screen">
          <div className={styles.align}>
            <p>가게 이름:</p>
            <input type="text" name="storeName" placeholder="가게명" />
            <p>ID: </p>
            <input type="text" name="id" placeholder="아이디" />
            <p>비밀번호: </p>
            <input type="password" name="password" placeholder="비밀번호" />
            <p>비밀번호 확인: </p>
            <input
              type="password"
              name="checkPassword"
              placeholder="비밀번호 확인"
            />
          </div>
        </section>
        <br />
        <button className={Button.style} onClick={onAfterRegister}>
          회원가입 하기
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
