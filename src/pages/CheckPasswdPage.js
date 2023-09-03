import Check from "../css/CheckPasswd.module.css";
import Button from "../css/Button.module.css";
import MenuBar from "../components/MenuBar";
import { postPWCheck } from "../components/API.module";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTokenRefresh from "../components/useTokenRefresh";

function CheckPasswdPage() {
  useTokenRefresh();

  const navigate = useNavigate();
  const uID = localStorage.getItem("u_id");

  const [pwCheck, setPWCheck] = useState("");
  const [pw, setPW] = useState("");
  const [showPasswdErrorMsg, setShowPasswdErrorMsg] = useState(false);

  const onCheck = async (e) => {
    e.preventDefault();

    /**api 및 response 확인 필요 */
    try {
      const res = await postPWCheck(uID, {
        pw: pwCheck,
      });

      console.log(res);

      if (res.data.state === "available") {
        showPasswdErrorMsg === true && setShowPasswdErrorMsg(false);
        setPW(pwCheck);
        // const uID =

        navigate("/admin-setting?uID=${uID}&sID=${sID}");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (error.response.data.detail === "Incorrect PW") {
          setShowPasswdErrorMsg(true);
        } else {
          console.log(error.response.data.detail);
        }
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <MenuBar />
      <div className={Check.backgroundDiv}>
        <div className={Check.inputForm}>
          <section className={Check.PasswdSection}>
            <label htmlFor="password">
              현재 비밀번호를 입력하세요
              <input
                id="password"
                type="password"
                name="password"
                placeholder="비밀번호"
                onChange={(e) => {
                  setPWCheck(e.target.value);
                  setShowPasswdErrorMsg(false);
                }}
              />
            </label>
          </section>
          {showPasswdErrorMsg && (
            <p>ID와 맞지 않는 비밀번호 입니다. 다시 입력해주세요.</p>
          )}

          <button className={Button.Check} onClick={onCheck}>
            비밀번호 확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckPasswdPage;
