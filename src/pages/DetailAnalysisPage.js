import MenuBar from "../components/MenuBar";
import Main from "../css/Main.module.css";
import Detail from "../css/DetailAnalysis.module.css";

function DetailAnalysisPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Detail.inner}></div>
    </div>
  );
}

export default DetailAnalysisPage;
