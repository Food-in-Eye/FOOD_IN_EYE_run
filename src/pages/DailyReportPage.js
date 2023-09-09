import MenuBar from "../components/MenuBar";
import Total from "../css/DailyReport.module.css";

function DailyReportPage() {
  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={Total.inner}>
        <p>전체 메뉴 분석 페이지</p>
      </div>
    </div>
  );
}

export default DailyReportPage;
