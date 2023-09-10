import MenuBar from "../components/MenuBar";
import DR from "../css/DailyReport.module.css";

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

      {Array.from(tabs).map((tab, index) => (
        <div
          key={index}
          className={DR.tabsToClick}
          onClick={tab.onMoveToElement}
        >
          {tab.name}
        </div>
      ))}

      <div ref={tabs[0].element} className={DR.tabElement}>
        <h2>오늘의 리포트</h2>
      </div>
      <div ref={tabs[1].element} className={DR.tabElement}>
        <h2>시간당 주문량 및 시선 수</h2>
      </div>
      <div ref={tabs[2].element} className={DR.tabElement}>
        <h2>시선/체류 시간과 주문량</h2>
      </div>
      <div ref={tabs[3].element} className={DR.tabElement}>
        <h2>메뉴별 방문 시선 수</h2>
      </div>
    </div>
  );
}

export default DailyReportPage;
