import MenuBar from "../components/MenuBar";
import Detail from "../css/DetailAnalysis.module.css";

function DetailAnalysisPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Detail.inner}>
        <p>메뉴별 분석 페이지</p>
      </div>
    </div>
  );
}

export default DetailAnalysisPage;
