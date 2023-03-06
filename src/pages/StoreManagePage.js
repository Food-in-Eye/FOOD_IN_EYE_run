import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Store from "../css/StoreManage.module.css";

function StoreManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Store.inner}></div>
    </div>
  );
}

export default StoreManagePage;
