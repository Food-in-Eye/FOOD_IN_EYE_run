import MenuBar from "../components/MenuBar";
import MPlace from "../css/MenuPlacement.module.css";

function MenuPlacementPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={MPlace.inner}>
        <p>메뉴판 배치 추천 페이지</p>
      </div>
    </div>
  );
}

export default MenuPlacementPage;
