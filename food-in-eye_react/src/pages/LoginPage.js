import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    navigate(`/main`);
  };

  return (
    <div>
      <h3>로그인</h3>
      <form>
        <input type="text" name="id" placeholder="아이디" />
        <input type="password" name="password" placeholder="비밀번호" />
        <button onClick={onLogin}>로그인</button>
      </form>
      <Link to={`/register`}>회원가입</Link>
    </div>
  );
}

export default LoginPage;
