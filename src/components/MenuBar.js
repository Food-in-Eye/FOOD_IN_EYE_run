// import Main from "../css/Main.module.css";
import style from "../css/MenuBar.module.css";

function MenuBar() {
  return (
    <section className={style.header}>
      <h2>LOGO</h2>
      <div className={style.dropMenu}>
        <ul>
          <li>
            <a href="./main" className={style.menubar_head}>
              Home
            </a>
          </li>
          <li>
            <a href="#!" className={style.menubar_head}>
              관리
            </a>
            <ul>
              <li>
                <a href="./store-manage">가게 관리</a>
              </li>
              <li>
                <a href="./menu-manage">메뉴 관리</a>
              </li>
              <li>
                <a href="./order-manage">주문 관리</a>
              </li>
              <li>
                <a href="./menu-position">메뉴판 배치</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#!" className={style.menubar_head}>
              분석
            </a>
            <ul>
              <li>
                <a href="./analysis">전체 메뉴분석</a>
              </li>
              <li>
                <a href="./analysis-detail">메뉴별 분석</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="./admin" className={style.menubar_head}>
              설정
            </a>
          </li>
        </ul>
      </div>

      <div className="logout">
        <ul className={style.util}>
          <li>
            <a href="/">Logout</a>
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
