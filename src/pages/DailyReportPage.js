import MenuBar from "../components/MenuBar";
import DR from "../css/DailyReport.module.css";
import CircleWithText from "../components/CircleWithText.module";
import useTokenRefresh from "../components/useTokenRefresh";
import { useRef } from "react";
import ScatterChart from "../charts/ScatterChart";
import BarChart from "../charts/BarChart";

function DailyReportPage() {
  useTokenRefresh();

  const useMoveScroll = (elementId) => {
    const element = useRef(null);
    const onMoveToElement = () => {
      element.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return { element, onMoveToElement, name: elementId };
  };

  const tabs = {
    0: useMoveScroll("오늘의 리포트"),
    1: useMoveScroll("시간당 주문량 및 시선 수"),
    2: useMoveScroll("시선/체류 시간과 주문량"),
    3: useMoveScroll("내 가게 메뉴판"),
    length: 4,
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>

      <div className={DR.tabsTable}>
        {Array.from(tabs).map((tab, index) => (
          <div
            key={index}
            className={DR.tabsToClick}
            onClick={tab.onMoveToElement}
          >
            {tab.name}
          </div>
        ))}
      </div>

      <div ref={tabs[0].element} className={DR.tabElement}>
        <span>오늘의 리포트</span>
        <div className={DR.todaysReport}>
          <section className={DR.todaysReportLeft}>
            <span>총 수입액:</span>
            <span>총 주문량:</span>
            <span>주문 당 평균 금액:</span>
          </section>
          <section className={DR.todaysReportRight}>
            <div>
              <span>오늘의 방문 누적 시간</span>
              <CircleWithText
                radius={70}
                text="8시간 13분"
                strokeColor="rgba(221, 11, 150, 0.2)"
              />
            </div>
            <div>
              <span>가게 방문 횟수</span>
              <CircleWithText
                radius={70}
                text="38회"
                strokeColor="rgba(14, 71, 216, 0.2)"
              />
            </div>
            <div>
              <span>시선의 응집 정도</span>
              <CircleWithText
                radius={70}
                text="63%"
                strokeColor="rgba(0, 128, 133, 0.2)"
              />
            </div>
          </section>
        </div>
        <div className={DR.ReportDesc}>
          <p>
            * 시선의 응집 정도
            <br />
            사용자의 전체 시선 중에서 응집되어있는 시선의 비율
          </p>
        </div>
      </div>
      <div ref={tabs[1].element} className={DR.tabElement}>
        <span>시간당 주문량 및 시선 수</span>
        <BarChart />
      </div>
      <div ref={tabs[2].element} className={DR.tabElement}>
        <span>시선/체류 시간과 주문량</span>
        <section className={DR.scatterChart}>
          <div className={DR.scatterChartLeftDiv}>
            <ScatterChart />
          </div>
          <div className={DR.scatterChartRightDiv}>
            <div className={DR.scatterChartDesc}>
              <span>✏️ 다음 분석에 대한 설명</span>
              <p>
                * 각 메뉴마다 시선이 얼마나 가는지에 따라 주문량에 영향이 있는지
                알 수 있습니다. <br />
                <br />* 메뉴에 사용자가 얼마나 머무르고 있는지에 따라 주문량에
                영향이 있는지 알 수 있습니다.
              </p>
            </div>
            <span>💡다음 분석은 이렇게 활용할 수 있어요!</span>
            <p></p>
          </div>
        </section>
      </div>
      <div ref={tabs[3].element} className={DR.tabElement}>
        <span>내 가게 메뉴판</span>
      </div>
    </div>
  );
}

export default DailyReportPage;
