import MenuBar from "../components/MenuBar";
import Total from "../css/Analysis.module.css";

function AnalysisPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Total.inner}></div>
    </div>
  );
}

export default AnalysisPage;
