import Register from "../css/Register.module.css";
import Button from "../css/Button.module.css";
import { postUser } from "../components/API.module";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useTokenRefresh from "../components/useTokenRefresh";

import littleLogo from "../images/little-logo.png";
import mainLogo from "../images/foodineye.png";

function RegisterPage() {
  useTokenRefresh();
  const navigate = useNavigate();

  const [idCheck, setIdCheck] = useState("");
  const [id, setId] = useState("");
  const [passwd, setPasswd] = useState("");
  const [passwdCheck, setPasswdCheck] = useState("");

  const [showIdDuplicateMsg, setShowIdDuplicateMsg] = useState(false);
  const [showIdUniqueMsg, setShowIdUniqueMsg] = useState(false);
  const [showValidPasswdMsg, setShowValidPasswdMsg] = useState(false);
  const [showPasswdMatchMsg, setShowPasswdMatchMsg] = useState(false);

  const handleIdDuplicate = async (e) => {
    e.preventDefault();

    try {
      const res = await postUser(`/idcheck`, {
        id: idCheck,
      });

      if (res.data.state === "available") {
        setShowIdUniqueMsg(true);
        setShowIdDuplicateMsg(false);
        setId(idCheck);
      } else if (res.data.state === "unavailable") {
        setShowIdUniqueMsg(false);
        setShowIdDuplicateMsg(true);
      }
    } catch (error) {
      console.error("Error checking ID duplicate:", error);
    }
  };

  const isPasswordValid = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return passwordPattern.test(password);
  };

  const handlePasswdChange = (e) => {
    setShowValidPasswdMsg(false);
    setShowPasswdMatchMsg(false);

    const newPasswd = e.target.value;
    setPasswd(newPasswd);
    setShowValidPasswdMsg(isPasswordValid(passwd));
  };

  const handlePasswdCheck = (e) => {
    setShowPasswdMatchMsg(false);

    const newPasswdCheck = e.target.value;
    setPasswdCheck(newPasswdCheck);
    setShowPasswdMatchMsg(newPasswdCheck === passwd);
  };

  const onRegister = async (e) => {
    e.preventDefault();

    if (showIdUniqueMsg && showValidPasswdMsg && showPasswdMatchMsg) {
      try {
        await postUser(`/seller/signup`, {
          id: id,
          pw: passwd,
        });
      } catch (error) {
        if (error.response.status === 409) {
          console.log(error.response.data.detail);
        } else {
          console.error("Error registering:", error);
        }
      }

      navigate(`/login`);
    } else {
      alert("회원가입 조건을 만족하지 않습니다. 다시 시도해주세요.");
    }
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
          <div className={Register.firstSection}>
            <section className={Register.IDSection}>
              <label htmlFor="id">
                아이디
                <input
                  id="id"
                  type="text"
                  name="id"
                  placeholder="아이디"
                  onChange={(e) => {
                    setIdCheck(e.target.value);
                    setShowIdUniqueMsg(false);
                    setShowIdDuplicateMsg(false);
                  }}
                  style={{
                    width: "350px",
                    border: showIdUniqueMsg ? "2px solid #52bf8b" : "",
                  }}
                />
              </label>
              <button
                className={Button.duplicateCheck}
                onClick={handleIdDuplicate}
              >
                아이디 중복 확인
              </button>
            </section>
            {showIdDuplicateMsg ? (
              <p style={{ color: "#B9062F" }}>이미 사용 중인 아이디 입니다.</p>
            ) : (
              showIdUniqueMsg && <p>사용 가능한 아이디 입니다.</p>
            )}
          </div>
          <div className={Register.secondSection}>
            <section className={Register.PasswdSection}>
              <label htmlFor="password">
                비밀번호
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두 포함이어야 합니다."
                  onChange={handlePasswdChange}
                  style={{
                    width: "600px",
                    border: showValidPasswdMsg ? "2px solid #52bf8b" : "",
                  }}
                />
              </label>
            </section>
            {showValidPasswdMsg ? (
              <p>사용 가능한 비밀번호 입니다.</p>
            ) : (
              passwd && (
                <p style={{ color: "#B9062F" }}>
                  비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두
                  포함이어야 합니다.
                </p>
              )
            )}
          </div>
          <div className={Register.thirdSection}>
            <section className={Register.PasswdCheckSection}>
              <label htmlFor="password-check">
                비밀번호 확인
                <input
                  id="password-check"
                  type="password"
                  name="passwordCheck"
                  placeholder="비밀번호 확인"
                  onChange={handlePasswdCheck}
                  style={{
                    width: "600px",
                    border:
                      showValidPasswdMsg && showPasswdMatchMsg
                        ? "2px solid #52bf8b"
                        : "",
                  }}
                />
              </label>
            </section>
            {!showPasswdMatchMsg && passwdCheck ? (
              <p style={{ color: "#B9062F" }}>
                비밀번호와 일치하지 않습니다. 다시 한번 입력해주세요.
              </p>
            ) : (
              showPasswdMatchMsg && passwdCheck && <p>비밀번호와 일치합니다.</p>
            )}
          </div>
          <button className={Button.register} onClick={onRegister}>
            회원가입 하기
          </button>
        </form>
      </section>
    </div>
  );
}

export default RegisterPage;
