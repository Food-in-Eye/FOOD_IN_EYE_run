import MenuBar from "../components/MenuBar";
import Benefit from "../css/BenefitManage.module.css";

function BenefitManagePage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Benefit.inner}>
        <p>혜택 관리 페이지</p>
      </div>
    </div>
  );
}

export default BenefitManagePage;
