import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Menu from "../css/MenuManage.module.css";

function MenuManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Menu.inner}>
        <section className="menus">
          <div className={Menu.menus}>
            <ul>
              <li>메뉴1</li>
              <li>메뉴2</li>
              <li>메뉴3</li>
              <li>메뉴4</li>
              <li>메뉴5</li>
            </ul>
          </div>
        </section>
        <hr className={Main.vertical} />
        <section className="menuInfo">
          <div className={Menu.info}>
            <div className={Menu.addModifyBtn}>
              <button>대표메뉴 추가</button>
              <button>수정 아이콘</button>
            </div>
            <img src={require("../images/burger.jpeg")} alt="메뉴1 사진"></img>
            <p>메뉴2</p>
            <br />
            <p>메뉴 설명</p>
            <br />
            <p>알레르기 정보</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MenuManagePage;
