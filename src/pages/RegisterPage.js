import { useNavigate } from "react-router-dom";
import Register from "../css/Register.module.css";
import Button from "../css/Button.module.css";

import littleLogo from "../images/little-logo.png";
import mainLogo from "../images/foodineye.png";

function RegisterPage() {
  const navigate = useNavigate();
  const onAfterRegister = (e) => {
    navigate(`/`);
  };
  return (
    <div className={Register.container}>
      <div className={Register.halfCircle}>
        <img className={Register.mainLogo} src={mainLogo} alt="foodineye" />
        <div>
          <p>Let's</p>
          <p>Get</p>
          <p>Start!</p>
        </div>
      </div>
      <img className={Register.littleLogo} src={littleLogo} alt="little-logo" />
      <section className={Register.RegisterForm}>
        <form>
          <section className={Register.StoreNameSection}>
            <label htmlFor="store-name">
              가게 이름
              <input
                id="store-name"
                type="text"
                name="storeName"
                placeholder="가게 이름"
                style={{ width: "350px" }}
              />
            </label>
            <button className={Button.duplicateCheck}>이름 중복 확인</button>
          </section>
          <section className={Register.IDSection}>
            <label htmlFor="id">
              ID
              <input
                id="id"
                type="text"
                name="id"
                placeholder="ID"
                style={{ width: "350px" }}
              />
            </label>
            <button className={Button.duplicateCheck}>ID 중복 확인</button>
          </section>
          <label htmlFor="password">
            비밀번호
            <input
              id="password"
              type="password"
              name="password"
              placeholder="비밀번호는 8자리 이상이어야 합니다."
              style={{ width: "600px" }}
            />
          </label>
          <label htmlFor="password-check">
            비밀번호 확인
            <input
              id="password-check"
              type="password"
              name="passwordCheck"
              placeholder="비밀번호 확인"
              style={{ width: "600px" }}
            />
          </label>
          <button className={Button.register} onClick={onAfterRegister}>
            회원가입 하기
          </button>
        </form>
      </section>
    </div>
  );
}

export default RegisterPage;
