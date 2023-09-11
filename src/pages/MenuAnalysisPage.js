import MenuBar from "../components/MenuBar";
import MAnalysis from "../css/MenuAnalysis.module.css";
import SemiCircleGaugeChart from "../charts/SemiCircleGaugeChart";
import RowBarChart from "../charts/RowBarChart";
import dailyReport from "../data/daily_report.json";

import { useRef } from "react";

function MenuAnalysisPage() {
  const aoiData = dailyReport["Store 1"].aoi_summary;
  const saleData = dailyReport["Store 1"].sale_summary;

  const useMoveScroll = (elementId) => {
    const element = useRef(null);
    const onMoveToElement = () => {
      element.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return { element, onMoveToElement, name: elementId };
  };

  const tabs = {
    0: useMoveScroll("메뉴 통계"),
    1: useMoveScroll("전체 시선 수 대비 시선의 응집 정도"),
    2: useMoveScroll("메뉴 페이지 통계"),
    3: useMoveScroll("메뉴 상세 페이지 통계"),
    4: useMoveScroll("페이지 내 시선수"),
    length: 5,
  };

  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>
      <div className={MAnalysis.tabsTable}>
        {Array.from(tabs).map((tab, index) => (
          <div
            key={index}
            className={MAnalysis.tabsToClick}
            onClick={tab.onMoveToElement}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div ref={tabs[0].element} className={MAnalysis.tabElement}>
        <div>
          <span>메뉴 이름</span>
          <section className={MAnalysis.menuSummarySection}>
            <div className={MAnalysis.menuSummarySectionDesc}>
              <p>
                이 메뉴가 언제 인기있는지 알 수 있어요! <br />
                그리고 이 메뉴가 가게 매출에 얼만큼 기여하는지 확인할 수 있어요.
              </p>
            </div>
            <div className={MAnalysis.menuSummaryBody}>
              <div className={MAnalysis.menuSummaryTime}>
                <p>인기 시간대</p>
                <span>시간대</span>
              </div>
              <div className={MAnalysis.menuSummarySales}>
                <p>총 매출액의 매출 기여도</p>
                <span>매출 기여도 퍼센트</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div ref={tabs[1].element} className={MAnalysis.tabElement}>
        <div>
          <span>전체 시선 수 대비 시선의 응집 정도</span>
          <section className={MAnalysis.GtoFRatioSection}>
            <p>
              사용자가 특정 부분을 고정적으로 주목했을 때 생기는 시선들의 집합을
              전체 시선 수에 대비하여 확률로 나타내었습니다.
              <br />
              이를 통해 사용자가 얼마나 오래 메뉴를 쳐다보고 있는지를 알 수
              있습니다.
            </p>
            {/* <div className={MAnalysis.GtoFRatioGraph}>
              <SemiCircleGaugeChart />
            </div> */}
            <div className={MAnalysis.GtoFRatioGraphDesc}></div>
          </section>
        </div>
      </div>
      <div ref={tabs[2].element} className={MAnalysis.tabElement}>
        <div>
          <span>메뉴 페이지 통계</span>
          <section className={MAnalysis.menuPageStatistics}>
            <div className={MAnalysis.menuPageStatisticsDesc}>
              <p>
                메뉴의 판매 개수, 사용자들이 메뉴판 페이지에서 이 메뉴에 얼마나
                관심을 갖고 바라봤는지, <br />
                메뉴판 페이지에서 해당 메뉴에 간 시선은 사용자의 전체 시선
                중에서 얼만큼을 차지하는지를 알 수 있어요!
                <br />
                <br />
                그리고 집중도 점수를 통해 메뉴에 대해 사용자들이 얼마나 집중
                있게 봤는지 알 수 있어요.
              </p>
            </div>
            <div className={MAnalysis.menuPageStatisticsBody}>
              <div className={MAnalysis.menuPageSaleCount}>
                <p>판매 개수</p>
                <span>100 개</span>
              </div>
              <div className={MAnalysis.menuPageDwellTime}>
                <p>총 체류시간</p>
                <span>320 시간</span>
              </div>
              <div className={MAnalysis.menuPageGazeRatio}>
                <p>총 시선 점유율</p>
                <span>45%</span>
              </div>
              <div className={MAnalysis.menuPageScore}>
                <p>집중도</p>
                <span>5.6 점</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div ref={tabs[3].element} className={MAnalysis.tabElement}>
        <div>
          <span>메뉴 상세 페이지 통계</span>
          <section className={MAnalysis.menuDetailPageStatistics}>
            <div className={MAnalysis.menuDetailPageStatisticsDesc}>
              <p>
                메뉴판에서 메뉴 클릭 시 들어가는 메뉴 상세 페이지의 방문 횟수와,
                사용자가 메뉴 상세 페이지에서 머무른 시간을 통해
                <br />
                사용자가 이 메뉴에 대해 얼마나 관심 있게 봤는지 알 수 있어요!
                <br />
                <br />
                그리고 방문 대비 주문율을 통해 관심에 비해 주문이 얼마나
                되었는지를 비율로 통해 확인할 수 있어요.
              </p>
            </div>
            <div className={MAnalysis.menuDetailPageStatisticsBody}>
              <div className={MAnalysis.menuDetailPageVisitCount}>
                <p>방문 횟수</p>
                <span>9 회</span>
              </div>
              <div className={MAnalysis.menuDetailPageDwellTime}>
                <p>총 체류시간</p>
                <span>320 시간</span>
              </div>
              <div className={MAnalysis.menuDetailOrderRatio}>
                <p>방문 대비 주문율</p>
                <span>30%</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div ref={tabs[4].element} className={MAnalysis.tabElement}>
        <div>
          <span>메뉴 상세 페이지 내 시선 수</span>
          <section className={MAnalysis.menuDetailPageGaze}>
            <div className={MAnalysis.menuDetailPageGazeDesc}>
              <p>
                메뉴 상세 페이지에서 사용자가 어느 부분을 바라봤는지 비율을 통해
                확인할 수 있어요!
              </p>
            </div>
            {/* <div className={MAnalysis.menuDetailPageGazeBody}>
              <RowBarChart data={data} />
            </div> */}
          </section>
        </div>
      </div>

      <div className={MAnalysis.divForButton}>
        <button className={MAnalysis.goUpButton} onClick={moveToTop}>
          ⇪
        </button>
      </div>
    </div>
  );
}

export default MenuAnalysisPage;
