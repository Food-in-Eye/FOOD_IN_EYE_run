import MenuBar from "../components/MenuBar";
import DR from "../css/DailyReport.module.css";
import CircleWithText from "../components/CircleWithText.module";

import { useRef } from "react";

function DailyReportPage() {
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
    3: useMoveScroll("메뉴별 방문 시선 수"),
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
      </div>
      <div ref={tabs[2].element} className={DR.tabElement}>
        <span>시선/체류 시간과 주문량</span>
      </div>
      <div ref={tabs[3].element} className={DR.tabElement}>
        <span>메뉴별 방문 시선 수</span>
      </div>
    </div>
  );
}

export default DailyReportPage;
