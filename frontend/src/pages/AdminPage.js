import MenuBar from "../components/MenuBar";
import Admin from "../css/Admin.module.css";

function AdminPage() {
  return (
    <div>
      <MenuBar />
      <div className={Admin.inner}>
        <p>설정 페이지</p>
      </div>
    </div>
  );
}

export default AdminPage;
