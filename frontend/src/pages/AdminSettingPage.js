import MenuBar from "../components/MenuBar";
import Button from "../css/Button.module.css";
import Admin from "../css/AdminSetting.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useTokenRefresh from "../components/useTokenRefresh";
import {
  getStore,
  putStore,
  putUser,
  postStore,
} from "../components/API.module";

function AdminSettingPage() {
  useTokenRefresh();

  const navigate = useNavigate();

  const id = localStorage.getItem("id");
  const uID = localStorage.getItem("u_id");
  const storeId = localStorage.getItem("s_id");
  const [store, setStore] = useState([]);

  const [name, setName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [newPasswd, setNewPasswd] = useState("");

  const [showPasswdMatchMsg, setShowPasswdMatchMsg] = useState(false);
  const [showValidPasswdMsg, setShowValidPasswdMsg] = useState(false);

  useEffect(() => {
    const getStoreName = async () => {
      try {
        const res = await getStore(storeId);
        setStore(res.data);
        setName(res.data.name);
      } catch (error) {
        console.error("가게 이름 가져오는 중 에러 발생:", error.response);
      }
    };

    getStoreName();
  }, [id]);

  // const handleNameDuplicate = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await postStore(`/namecheck`, {
  //       name: nameCheck,
  //     });

  //     if (res.data.state === "available") {
  //       setShowNameDuplicateMsg(false);
  //       setShowNameUniqueMsg(true);
  //       setNewName(nameCheck);
  //     } else if (res.data.state === "unavailable") {
  //       setShowNameDuplicateMsg(true);
  //       setShowNameUniqueMsg(false);
  //     }
  //   } catch (error) {
  //     console.error("가게 이름 중복 확인 중 오류 발생:", error);
  //   }
  // };

  const isPasswordValid = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    return passwordPattern.test(password);
  };

  const handlePasswdCheck = (newPassword) => {
    const isValid = isPasswordValid(newPassword);
    if (!isValid) {
      setShowValidPasswdMsg(false);
      return;
    }

    const isMatch = passwd === newPassword;

    if (!isMatch) {
      setNewPasswd(newPassword);
    }
    setShowValidPasswdMsg(true);
    setShowPasswdMatchMsg(isMatch);
  };

  const onChangeSetting = async (e) => {
    e.preventDefault();

    try {
      if (showValidPasswdMsg && !showPasswdMatchMsg) {
        const res = await putUser(`/seller/change?u_id=${uID}`, {
          id: id,
          old_pw: passwd,
          new_pw: newPasswd,
        });

        if (res.status === 200) {
          // await putStore(storeId, {
          //   ...store,
          //   name: name,
          // }).catch((error) => {
          //   if (error.response.state === 409) {
          //     console.log(error.response.data.detail);
          //   } else if (error.response.state === 503) {
          //     console.log(error.response.data.detail);
          //   } else {
          //     console.error("가게 이름 업데이트 중 오류 발생:", error);
          //   }
          // });

          navigate(`/main`);
        }
      }
    } catch (error) {
      if (error.response.state === 401) {
        console.log(error.response.data.detail);
        alert("정보가 존재하지 않거나 일치하지 않습니다. 다시 입력해주세요.");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <MenuBar />
      <div className={Admin.background}>
        <div className={Admin.body}>
          <section className={Admin.desc}>
            <h1>Account Settings</h1>
            <span>비밀번호를 수정할 수 있습니다.</span>
          </section>
          <section className={Admin.EditForm}>
            <form>
              <section className={Admin.LastStoreNameSection}>
                <span>가게 이름</span>
                <p>{name}</p>
              </section>
              {/* <section className={Admin.storeNameSection}>
                <label htmlFor="store-name">
                  <span>가게 이름</span>
                  <input
                    id="store-name"
                    type="text"
                    name="store-name"
                    placeholder="가게 이름"
                    value={showNameUniqueMsg ? newName : nameCheck}
                    onChange={(e) => {
                      if (!showNameUniqueMsg) {
                        setNameCheck(e.target.value);
                      }
                      setShowNameUniqueMsg(false);
                      setShowNameDuplicateMsg(false);
                    }}
                    style={{
                      border:
                        nameCheck && showNameUniqueMsg && "2px solid #52bf8b",
                    }}
                  />
                </label>
                <button
                  className={Button.duplicateCheck}
                  onClick={handleNameDuplicate}
                >
                  이름 중복 확인
                </button>
              </section>
              <div className={Admin.pSection}>
                {nameCheck && showNameDuplicateMsg ? (
                  <p style={{ color: "#B9062F" }}>
                    이미 사용 중인 이름 입니다.
                  </p>
                ) : (
                  newName &&
                  !showNameDuplicateMsg && (
                    <p className={Admin.pSection}>사용 가능한 이름 입니다.</p>
                  )
                )}
              </div> */}
              <section className={Admin.IDSection}>
                <span>아이디</span>
                <p>{id}</p>
              </section>
              <section className={Admin.PWSection}>
                <label htmlFor="password">
                  <span>이전 비밀번호</span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="이전 비밀번호를 입력하세요."
                    onChange={(e) => {
                      setPasswd(e.target.value);
                    }}
                    style={{
                      width: "600px",
                    }}
                  />
                </label>
              </section>

              <section className={Admin.PWCheckSection}>
                <label htmlFor="password-check">
                  <span>신규 비밀번호</span>
                  <input
                    id="password-check"
                    type="password"
                    name="passwordCheck"
                    placeholder="비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두 포함이어야 합니다."
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      // setNewPasswd(newPassword);
                      handlePasswdCheck(newPassword);
                    }}
                    style={{
                      width: "600px",
                      border:
                        showValidPasswdMsg && !showPasswdMatchMsg
                          ? "2px solid #52bf8b"
                          : "",
                    }}
                  />
                </label>
              </section>
              <div className={Admin.pSection}>
                {newPasswd ? (
                  !showPasswdMatchMsg && showValidPasswdMsg ? (
                    <p>사용 가능한 비밀번호 입니다.</p>
                  ) : (
                    passwd && (
                      <p style={{ color: "#B9062F" }}>
                        {showValidPasswdMsg && newPasswd && showPasswdMatchMsg
                          ? "이전 비밀번호와 동일합니다."
                          : "비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두 포함이어야 합니다."}
                      </p>
                    )
                  )
                ) : null}
              </div>
            </form>
          </section>
        </div>
        <button className={Button.changeUser} onClick={onChangeSetting}>
          회원 정보 변경하기
        </button>
      </div>
    </div>
  );
}

export default AdminSettingPage;
