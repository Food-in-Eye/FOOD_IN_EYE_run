import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const onAfterRegister = (e) => {
    navigate(`/`);
  };
  return (
    <div>
      <h3>회원가입</h3>
      <form>
        <input type="text" name="storeName" placeholder="가게명" />
        <input type="text" name="id" placeholder="아이디" />
        <input type="password" name="password" placeholder="비밀번호" />
        <input
          type="password"
          name="checkPassword"
          placeholder="비밀번호 확인"
        />
        <button onClick={onAfterRegister}>회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
