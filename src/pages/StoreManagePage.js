import MenuBar from "../components/MenuBar";
import Store from "../css/StoreManage.module.css";

function StoreManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Store.inner}>
        <p>가게 관리 페이지</p>
      </div>
    </div>
  );
}

export default StoreManagePage;
