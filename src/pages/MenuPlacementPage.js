import MenuBar from "../components/MenuBar";
import TheMenus from "../components/TheMenus.module";
import MPlace from "../css/MenuPlacement.module.css";

import arrow from "../images/right_arrow.jpeg";

function MenuPlacementPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={MPlace.inner}>
        <div className={MPlace.menus}>
          <h2>
            <span>메뉴 리스트</span>
          </h2>
          <ul>
            <li>1. 메뉴1</li>
            <li>2. 메뉴2</li>
          </ul>
        </div>
        <div className={MPlace.middle}>
          <p>
            드래그앤 드롭으로
            <br />
            메뉴판을 손쉽게 바꾸세요!
          </p>
          <img src={arrow} alt="화살표 이미지" />
        </div>
        <div className={MPlace.theMenu}>
          <h2>메뉴판</h2>
          <TheMenus />
          <button>수정하기</button>
        </div>
      </div>
    </div>
  );
}

export default MenuPlacementPage;
