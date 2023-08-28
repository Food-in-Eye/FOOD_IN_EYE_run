import MenuBar from "../components/MenuBar";
import Button from "../css/Button.module.css";
import Admin from "../css/AdminSetting.module.css";

import { useState } from "react";

function AdminSettingPage() {
  const [nameCheck, setNameCheck] = useState("");
  const [name, setName] = useState("");
  const [idCheck, setIdCheck] = useState("");
  const [id, setId] = useState("");
  const [passwd, setPasswd] = useState("");
  const [passwdCheck, setPasswdCheck] = useState("");

  const [showNameDuplicateMsg, setShowNameDuplicateMsg] = useState(false);
  const [showNameUniqueMsg, setShowNameUniqueMsg] = useState(false);
  const [showIdDuplicateMsg, setShowIdDuplicateMsg] = useState(false);
  const [showIdUniqueMsg, setShowIdUniqueMsg] = useState(false);
  const [showValidPasswdMsg, setShowValidPasswdMsg] = useState(false);
  const [showPasswdMatchMsg, setShowPasswdMatchMsg] = useState(false);

  const onChangeSetting = (e) => {};

  return (
    <div>
      <MenuBar />
      <div className={Admin.background}>
        <div className={Admin.body}>
          <section className={Admin.desc}>
            <h1>Account Settings</h1>
            <span>가게 이름과 계정 정보를 수정할 수 있습니다.</span>
          </section>
          <section className={Admin.EditForm}>
            <form>
              <section className={Admin.storeNameSection}>
                <label htmlFor="store-name">
                  <span>가게 이름</span>
                  <input
                    id="store-name"
                    type="text"
                    name="store-name"
                    placeholder="가게 이름"
                    // onChange={(e) => {
                    //   setIdCheck(e.target.value);
                    //   setShowIdUniqueMsg(false);
                    //   setShowIdDuplicateMsg(false);
                    // }}
                    style={{
                      width: "350px",
                      border: showNameUniqueMsg ? "2px solid #52bf8b" : "",
                    }}
                  />
                </label>
                <button
                  className={Button.duplicateCheck}
                  // onClick={handleIdDuplicate}
                >
                  이름 중복 확인
                </button>
              </section>
              {showNameDuplicateMsg ? (
                <p style={{ color: "#B9062F" }}>이미 사용 중인 이름 입니다.</p>
              ) : (
                showNameDuplicateMsg && <p>사용 가능한 이름 입니다.</p>
              )}
              <section className={Admin.IDSection}>
                <span>아이디</span>
                <p>ID값</p>
              </section>
              <section className={Admin.PWSection}>
                <label htmlFor="password">
                  <span>비밀번호</span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두 포함이어야 합니다."
                    // onChange={handlePasswdChange}
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
              <section className={Admin.PWCheckSection}>
                <label htmlFor="password-check">
                  <span>비밀번호 확인</span>
                  <input
                    id="password-check"
                    type="password"
                    name="passwordCheck"
                    placeholder="비밀번호 확인"
                    // onChange={handlePasswdCheck}
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
                showPasswdMatchMsg &&
                passwdCheck && <p>비밀번호와 일치합니다.</p>
              )}
            </form>
          </section>
        </div>
        <button className={Button.register} onClick={onChangeSetting}>
          회원 정보 변경하기
        </button>
      </div>
    </div>
  );
}

export default AdminSettingPage;
