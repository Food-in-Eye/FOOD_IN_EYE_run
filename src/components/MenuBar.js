import style from "../css/MenuBar.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function MenuBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const onLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("u_id");
    localStorage.removeItem("s_id");
    localStorage.removeItem("a_token");
    localStorage.removeItem("r_token");
    localStorage.removeItem("r_token_create_time");
    localStorage.removeItem("storeNum");

    logout();

    navigate(`/login`);
  };

  return (
    <section className={style.header}>
      <h2>LOGO</h2>
      <div className={style.dropMenu}>
        <ul className={style.menubarHeader}>
          <li>
            <a href="./main" className={style.menubarSub}>
              Home
            </a>
          </li>
          <li>
            <a href="#!" className={style.menubarSub}>
              관리
            </a>
            <ul className={style.menubarSubOfSub}>
              <li>
                <a href="./store-manage">가게 관리</a>
              </li>
              <li>
                <a href="./menu-manage">메뉴 관리</a>
              </li>
              <li>
                <a href="./order-manage">누적 주문 관리</a>
              </li>
              <li>
                <a href="./menu-placement">메뉴판 배치</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#!" className={style.menubarSub}>
              분석
            </a>
            <ul className={style.menubarSubOfSub}>
              <li>
                <a href="./daily-report">데일리 리포트</a>
              </li>
              <li>
                <a href="./menu-analysis">메뉴별 분석</a>
              </li>
              <li>
                <a href="./gaze-visualize">Gaze 시각화</a>
              </li>
              <li>
                <a href="./gaze-visualize-no-background">Gaze 시각화(배경x)</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="./check-passwd" className={style.menubarSub}>
              설정
            </a>
          </li>
        </ul>
      </div>

      <div className="logout">
        <ul className={style.util}>
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <div className={style.profile}>
        <img src={require("../images/profile.jpeg")} alt="프로필 이미지"></img>
        <h3>00가게</h3>
      </div>
    </section>
  );
}

export default MenuBar;
