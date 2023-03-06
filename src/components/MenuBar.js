// import Main from "../css/Main.module.css";
import style from "../css/MenuBar.module.css";

function MenuBar() {
  return (
    <section className={style.header}>
      <h2>LOGO</h2>
      <ul className={style.gnb}>
        <li>
          <a href="./main">Home</a>
        </li>
        <li>
          <a href="./menu-manage">관리</a>
        </li>
        <li>
          <a href="./analysis">분석</a>
        </li>
        <li>
          <a href="./admin">설정</a>
        </li>
      </ul>

      <ul className={style.util}>
        <li>
          <a href="/">Logout</a>
        </li>
      </ul>

      <div className={style.profile}>
        <img src={require("../images/profile.jpeg")} alt="프로필 이미지"></img>
        <h3>00가게</h3>
      </div>
    </section>
  );
}

export default MenuBar;
