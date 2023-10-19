import MenuBar from "../components/MenuBar";
import TR from "../css/TotalReport.module.css";
import CircleWithText from "../components/CircleWithText.module";
import useTokenRefresh from "../components/useTokenRefresh";
import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DailyScatterChart from "../charts/DailyScatterChart";
import BarChart from "../charts/BarChart";
import TheMenuChart from "../charts/TheMenuChart";

function TotalReportPage() {
  useTokenRefresh();
  const navigate = useNavigate();
  const location = useLocation();

  const { reportDate, dailyReportData } = location?.state || {};

  console.log("dailyReport", dailyReportData);

  const aoiData = dailyReportData.aoi_summary;
  const saleData = dailyReportData.sale_summary;

  const totalDwellTime = `${(aoiData.total_dwell_time / 60000).toFixed(1)} 분`;
  const visitCount = `${aoiData.store_visit} 회`;
  const gToFRatio = `${(
    (aoiData.total_fix_count / aoiData.total_gaze_count) *
    100
  ).toFixed(1)} %`;

  const useMoveScroll = (elementId) => {
    const element = useRef(null);
    const onMoveToElement = () => {
      element.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return { element, onMoveToElement, name: elementId };
  };

  const tabs = {
    0: useMoveScroll("오늘의 리포트"),
    1: useMoveScroll("시간당 주문량 및 체류시간"),
    2: useMoveScroll("시선/체류 시간과 주문량"),
    3: useMoveScroll("내 가게 메뉴판"),
    length: 4,
  };

  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moveToMenusAnalysis = () => {
    navigate("/select-menu");
  };

  return (
    <div>
      <section className="header">
        <MenuBar />
      </section>

      <div className={TR.tabsTable}>
        {Array.from(tabs).map((tab, index) => (
          <div
            key={index}
            className={TR.tabsToClick}
            onClick={tab.onMoveToElement}
          >
            {tab.name}
          </div>
        ))}
      </div>

      <div ref={tabs[0].element} className={TR.tabElement}>
        <span className={TR.tabElementFirstSpan}>{reportDate}의 리포트</span>
        <div className={TR.todaysReport}>
          <section className={TR.todaysReportLeft}>
            <span>
              <strong>총 매출액: </strong>
              {saleData.total_sales}원
            </span>
            <span>
              <strong>총 판매건수: </strong>
              {saleData.total_order}건
            </span>
            <span>
              <strong>주문 당 평균 금액: </strong>
              {saleData.average_sales_per_order.toFixed(0)}원
            </span>
          </section>
          <section className={TR.todaysReportRight}>
            <div>
              <span>오늘의 방문 누적 시간</span>
              <CircleWithText
                radius={70}
                text={totalDwellTime}
                strokeColor="rgba(204, 221, 239)"
              />
            </div>
            <div>
              <span>가게 방문 횟수</span>
              <CircleWithText
                radius={70}
                text={visitCount}
                strokeColor="rgba(157, 195, 156, 0.7)"
              />
            </div>
            <div>
              <span>시선의 응집 정도</span>
              <CircleWithText
                radius={70}
                text={gToFRatio}
                strokeColor="rgba(187, 145, 227, 0.7)"
              />
            </div>
          </section>
        </div>
        <div className={TR.ReportDesc}>
          <p>
            * 시선의 응집 정도
            <br />
            사용자의 전체 시선 중에서 응집되어있는 시선의 비율
          </p>
        </div>
      </div>
      <div ref={tabs[1].element} className={TR.tabElement}>
        <span className={TR.tabElementFirstSpan}>
          시간당 판매건수 및 체류 시간
        </span>
        <div className={TR.barChart}>
          <BarChart />
        </div>
      </div>
      <div ref={tabs[2].element} className={TR.tabElement}>
        <span className={TR.tabElementFirstSpan}>시선/체류 시간과 주문량</span>
        <section className={TR.scatterChart}>
          <div className={TR.scatterChartLeftDiv}>
            <DailyScatterChart data={dailyReportData} />
          </div>
          <div className={TR.scatterChartRightDiv}>
            <div className={TR.scatterChartDesc}>
              <div className={TR.scatterChartDescUp}>
                <span>✏️ 다음 분석에 대한 설명</span>
                <p>
                  * 각 메뉴마다 시선이 얼마나 가는지에 따라 주문량에 영향이
                  있는지 알 수 있습니다.
                </p>
                <p>
                  * 메뉴에 사용자가 얼마나 머무르고 있는지에 따라 주문량에
                  영향이 있는지 알 수 있습니다.
                </p>
              </div>
              <div className={TR.scatterChartDescDown}>
                <span>💡다음 분석은 이렇게 활용할 수 있어요!</span>
                <p>
                  시선 수가 많을수록 주문량이 많은 메뉴는 사용자의 눈길을 끌고
                  구매까지 간 메뉴들이에요!
                </p>
                <p>
                  시선 수가 적지만 주문량이 많은 메뉴는 매니아층이 있는
                  메뉴들이에요😃
                </p>
                <p>
                  시선 수는 많지만 주문량이 없는 메뉴는 사용자의 눈길을 끌지만
                  구매는 되지 않은 메뉴들이에요🙁
                </p>
                <p>
                  시선 수가 적고 주문량도 적은 메뉴는 사용자들이 잘 찾지 않는
                  메뉴들이에요. <br />
                  다른 메뉴로 바꾸시는 건 어떠신가요?
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div ref={tabs[3].element} className={TR.tabElement}>
        <span className={TR.tabElementFirstSpan}>내 가게 메뉴판</span>
        <div className={TR.buttonToMenuAnalysis}>
          <button onClick={moveToMenusAnalysis}>메뉴별 분석 보러가기 ⇨</button>
        </div>
        <div className={TR.menuChart}>
          <div className={TR.menuChartDesc}>
            <p>
              원하는 것을 골라서 메뉴들을 한눈에 확인하고 비교해보세요!
              <br />
              👀사용자의 시선이 포함된 기준들: 체류시간, 집중도
            </p>
          </div>

          <div className={TR.menuChartBody}>
            <div className={TR.menuChartUpDiv}>
              <TheMenuChart data={dailyReportData} />
            </div>
            <div className={TR.menuChartDownDiv}>
              <div className={TR.menuChartDescUp}>
                <span>✏️ 다음 분석에 대한 설명</span>
                <p>
                  * 집중도는 사용자가 해당 메뉴에 대해 얼마나 집중하였는지 저희
                  웹에서 사용하는 공식을 통해 도출한 점수입니다.
                </p>
              </div>
              <div className={TR.menuChartDescDown}>
                <span>💡다음 분석은 이렇게 활용할 수 있어요!</span>
                <p>
                  어떤 메뉴가 잘 팔리는지, 인기가 많은지 등을 한눈에 비교해볼 수
                  있습니다.
                </p>
                <p>
                  그리고 사용자가 잘 쳐다보지 않았거나 집중도 점수가 낮거나 등을
                  통해 어떤 메뉴를 보완해야 할 지 확인할 수 있어요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={TR.divForButton}>
        <button className={TR.goUpButton} onClick={moveToTop}>
          ⇪
        </button>
      </div>
    </div>
  );
}

export default TotalReportPage;
