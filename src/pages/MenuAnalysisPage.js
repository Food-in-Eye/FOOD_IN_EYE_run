import MenuBar from "../components/MenuBar";
import MAnalysis from "../css/MenuAnalysis.module.css";
import PieChartWithNeedle from "../charts/PieChartWithNeedle";
import VerticalBarChart from "../charts/VerticalBarChart";
import dailyReport from "../data/daily_report.json";
import menuDetailPage from "../images/menu-detail-ex.jpeg";

import { useEffect, useRef, useState } from "react";
import PieChartForFood from "../charts/PieChartForFood";
import PieChartForFixation from "../charts/PieChartForFixation";
import BarChartWithAvg from "../charts/BarChartWithAvg";

function MenuAnalysisPage() {
  const aoiData = dailyReport["Store 1"].aoi_summary;
  const saleData = dailyReport["Store 1"].sale_summary;
  const fNum = "Food 6";
  const [maxHour, setMaxHour] = useState(-1);
  const [saleRatio, setSaleRatio] = useState(0);
  const [menuSalesCount, setMenuSalesCount] = useState(0);
  // const [dwellTime, setDwellTime] = useState(0);
  const [score, setScore] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [salesPerVisit, setSalesPerVisit] = useState(0);
  const [salesPerVisitData, setSalesPerVisitData] = useState(0);

  const [fixCount, setFixCount] = useState(0);
  const [gazeCount, setGazeCount] = useState(0);
  const [foodsPercentage, setFoodsPercentage] = useState(0);

  const [fixDataInDetail, setFixDataInDetail] = useState([]);
  const [fixRatio, setFixRatio] = useState([]);
  const [menuPageDwellTime, setMenuPageDwellTime] = useState([]);
  const [menuDetailDwellTime, setMenuDetailDwellTime] = useState([]);

  console.log("aoiData", aoiData);
  console.log("saleData", saleData);

  const setSaleData = () => {
    let maxCount = -1;
    let maxHour = -1;

    const foodDetail = saleData.food_detail[fNum];
    const hoursData = foodDetail.hourly_sale_info;
    hoursData.forEach((hourlyInfo, hour) => {
      if (hourlyInfo.count > maxCount) {
        maxCount = hourlyInfo.count;
        maxHour = hour;
      }
    });

    const menuTotalSales = foodDetail.total_sales;
    const totalSales = saleData.total_sales;

    setMaxHour(maxHour);
    setMenuSalesCount(foodDetail.total_count);
    setSaleRatio(parseInt(((menuTotalSales / totalSales) * 100).toFixed(0)));

    console.log("menuTotalSales, totalSales", menuTotalSales, totalSales);
  };

  const setAoiData = () => {
    const foodDetail = aoiData.total_food_report[fNum];
    const menuFixCount = foodDetail.fix_count;
    const totalFixCount = aoiData.total_fix_count;

    // setDwellTime((foodDetail.duration / 10000).toFixed(2));
    setFixRatio(((menuFixCount / totalFixCount) * 100).toFixed(1));
    setScore(foodDetail.score);
    setVisitCount(foodDetail.in_detail.visit);
    // setDuration((foodDetail.in_detail.duration / 10000).toFixed(2));

    getPercentageOfFixData(foodDetail.in_detail.fix_count);
  };

  const setDwellTimes = () => {
    const menuPageDurations = [];
    const menuDetailDurations = [];

    for (const foodName in aoiData.total_food_report) {
      if (foodName !== "ETC" && foodName !== "Store INFO") {
        const foodData = aoiData.total_food_report[foodName];
        const duration = (foodData.duration / 10000).toFixed(2);
        const detailDuration = (foodData.in_detail.duration / 10000).toFixed(2);

        const foodDuration = {
          name: foodName,
          duration: duration,
        };

        const foodDetailDuration = {
          name: foodName,
          duration: detailDuration,
        };

        menuPageDurations.push(foodDuration);
        menuDetailDurations.push(foodDetailDuration);
      }
    }

    setMenuPageDwellTime(menuPageDurations);
    setMenuDetailDwellTime(menuDetailDurations);
  };

  const setFixationRatios = () => {
    const fixationValues = [];

    for (const foodName in aoiData.total_food_report) {
      if (foodName !== "ETC" && foodName !== "Store INFO") {
        const foodData = aoiData.total_food_report[foodName];
        const fixCount = foodData.fix_count;

        const foodFixCount = {
          name: foodName,
          value: fixCount,
        };

        fixationValues.push(foodFixCount);
      }
    }
    setFixRatio(fixationValues);
  };

  const updateFixAndGazeCountList = () => {
    const fixAndGazeArray = [];

    for (const foodName in aoiData.total_food_report) {
      if (foodName !== "ETC" && foodName !== "Store INFO") {
        const foodData = aoiData.total_food_report[foodName];
        const detailData = foodData.in_detail;

        const detailFixCount =
          detailData.fix_count.name +
          detailData.fix_count.image +
          detailData.fix_count.info +
          detailData.fix_count.price +
          detailData.fix_count.etc;
        const detailGazeCount =
          detailData.gaze_count.name +
          detailData.gaze_count.image +
          detailData.gaze_count.info +
          detailData.gaze_count.price +
          detailData.gaze_count.etc;
        const fixCount = foodData.fix_count || 0 + detailFixCount;

        const gazeCount = foodData.gaze_count || 0 + detailGazeCount;

        fixAndGazeArray.push({
          name: foodName,
          gaze_count: gazeCount,
          fixation_count: fixCount,
        });
      }
    }

    DegreeOfFixComparedToGaze(fixAndGazeArray);
  };

  useEffect(() => {
    setSaleData();
    setAoiData();
    setDwellTimes();
    setFixationRatios();
    setSalesPerVisitData({
      menuSalesCount: menuSalesCount,
      visitCount: visitCount,
    });
    // setSalesPerVisit(((menuSalesCount / visitCount) * 100).toFixed(0));
  }, [fNum, menuSalesCount, visitCount]);

  useEffect(() => {
    updateFixAndGazeCountList();
  }, []);

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

  const DegreeOfFixComparedToGaze = (data) => {
    // 최소 및 최대값 초기화
    let minValue = Infinity;
    let maxValue = -Infinity;

    // Fixation/Gaze 비율 계산 및 최소/최대값 찾기
    data.forEach((item) => {
      const ratio = item.fixation_count / item.gaze_count;
      if (ratio < minValue) {
        minValue = ratio;
      }
      if (ratio > maxValue) {
        maxValue = ratio;
      }
    });

    // Fixation/Gaze 비율을 [0, 1] 범위로 정규화
    const normalizeData = (data, minValue, maxValue) => {
      return data.map((item) => ({
        ...item,
        normalized_ratio:
          (item.fixation_count / item.gaze_count - minValue) /
          (maxValue - minValue),
      }));
    };

    // 'Food 6' 메뉴의 정규화된 값을 찾아 상위 몇 퍼센트에 속하는지 계산
    const findPercentile = (data, targetName) => {
      const targetItem = data.find((item) => item.name === targetName);
      setFixCount(targetItem.fixation_count);
      setGazeCount(targetItem.gaze_count);
      const targetValue = targetItem.normalized_ratio;

      const percentile =
        (data.filter((item) => item.normalized_ratio > targetValue).length /
          data.length) *
        100;

      if (percentile <= 5) {
        return 5;
      } else if (percentile <= 10) {
        return 10;
      } else if (percentile <= 20) {
        return 20;
      } else if (percentile <= 30) {
        return 30;
      } else if (percentile <= 40) {
        return 40;
      } else if (percentile <= 50) {
        return 50;
      } else if (percentile <= 60) {
        return 60;
      } else if (percentile <= 70) {
        return 70;
      } else if (percentile <= 80) {
        return 80;
      } else if (percentile <= 90) {
        return 90;
      } else {
        return percentile;
      }
    };

    // 정규화된 데이터 반환
    const normalizedData = normalizeData(data, minValue, maxValue);
    console.log("normalizedData", normalizedData);
    // const sortedData = normalizedData
    //   .slice()
    //   .sort((a, b) => b.normalized_ratio - a.normalized_ratio);
    // const rank = sortedData.findIndex((item) => item.name === fNum) + 1;

    // setFoodRankOfGtoF(rank);

    // 'Food 6' 메뉴의 상위 백분위수 계산
    const percentileFood = findPercentile(normalizedData, fNum);
    console.log("percentile", percentileFood);
    setFoodsPercentage(percentileFood.toFixed(0));

    return percentileFood;
  };

  const getPercentageOfFixData = (fixData) => {
    const fixPercentageObject = {};

    const totalSum = Object.values(fixData).reduce((acc, val) => acc + val, 0);

    Object.entries(fixData).forEach(([key, value]) => {
      // 각 칸의 비율 계산
      const percentage =
        (value / totalSum) * 100 !== 0
          ? ((value / totalSum) * 100).toFixed(1)
          : ((value / totalSum) * 100).toFixed(0);

      fixPercentageObject[key] = percentage;
    });

    setFixDataInDetail(fixPercentageObject);
  };

  console.log("fixCount, gazeCount", fixCount, gazeCount);
  console.log("fixDataInDetail", fixDataInDetail);

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
              <div className={MAnalysis.menuSummarySaleCount}>
                <p>판매 개수</p>
                <span>{menuSalesCount} 개</span>
              </div>
              <div className={MAnalysis.menuSummaryTime}>
                <p>인기 시간대</p>
                <span>{maxHour} 시</span>
              </div>
              <div className={MAnalysis.menuSummarySales}>
                <p>총 매출액의 매출 기여도</p>
                {/* <PieChartForFood saleRatio={saleRatio} /> */}
                <span>{saleRatio} %</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div ref={tabs[1].element} className={MAnalysis.tabElement}>
        <div>
          <span>전체 시선 수 대비 시선의 응집 정도</span>
          <section className={MAnalysis.GtoFRatioSection}>
            <div className={MAnalysis.GtoFRatioSectionDesc}>
              <p>
                사용자가 특정 부분을 고정적으로 주목했을 때 생기는 시선들의
                집합을 전체 시선 수에 대비하여 확률로 나타냈습니다.
                <br />
                이를 통해 사용자가 얼마나 오래 메뉴를 쳐다보고 있는지를 알 수
                있어요!
                <br />
                <br />* Fixation: 사용자가 특정 부분을 고정적으로 주목했을 때
                생기는 시선들의 집합
              </p>
            </div>
            <div className={MAnalysis.GtoFRatioBody}>
              <div className={MAnalysis.GtoFRatioValue}>
                <p>시선 수 대비 Fixation 수 비율</p>
                <span>{((fixCount / gazeCount) * 100).toFixed(1)} %</span>
                <div className={MAnalysis.GtoFRatioPieChart}>
                  <PieChartWithNeedle fc={fixCount} gc={gazeCount} />
                </div>
              </div>
              <div className={MAnalysis.GtoFRatioPercent}>
                <p>
                  전 메뉴 중 <strong style={{ fontSize: "20px" }}>상위 </strong>
                </p>
                <p>
                  <span>{foodsPercentage} % </span>이내
                </p>
                {/* <span>{foodRankOfGtoF} 등</span> */}
              </div>
            </div>
            {/* <div className={MAnalysis.GtoFRatioGraphDesc}></div> */}
          </section>
        </div>
      </div>
      <div ref={tabs[2].element} className={MAnalysis.tabElement}>
        <div>
          <span>메뉴판 페이지 통계</span>
          <section className={MAnalysis.menuPageStatistics}>
            <div className={MAnalysis.menuPageStatisticsDesc}>
              <p>
                사용자들이 메뉴판 페이지에서 이 메뉴에 얼마나 관심을 갖고
                바라봤는지, <br />
                메뉴판 페이지에서 해당 메뉴에 간 시선은 사용자의 전체 시선
                중에서 얼만큼을 차지하는지를 알 수 있어요!
                <br />
                <br />
                그리고 집중도 점수를 통해 메뉴에 대해 사용자들이 얼마나 집중
                있게 봤는지 알 수 있어요.
              </p>
            </div>
            <div className={MAnalysis.menuPageStatisticsBody}>
              <div className={MAnalysis.menuPageScore}>
                <p>집중도(0점 ~ 5점)</p>
                <span>{score} 점</span>
              </div>
              <div className={MAnalysis.menuPageDwellTime}>
                <p>총 체류시간</p>
                <div className={MAnalysis.barChartWithAvg1}>
                  <BarChartWithAvg data={menuPageDwellTime} />
                </div>
                {/* <span>{dwellTime} 초</span> */}
              </div>
              <div className={MAnalysis.menuPageGazeRatio}>
                <p>총 시선 점유율</p>
                <div className={MAnalysis.pieChartForFix}>
                  <PieChartForFixation data={fixRatio} />
                </div>
                {/* <span>{fixRatio} %</span> */}
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
                그리고 메뉴 상세 페이지의 방문 횟수에 비해 얼마나 판매되었는지
                방문 대비 판매 건수을 통해 확인할 수 있어요.
              </p>
            </div>
            <div className={MAnalysis.menuDetailPageStatisticsBody}>
              {/* <div className={MAnalysis.menuDetailPageVisitCount}>
                <p>방문 횟수</p>
                <span>{visitCount} 회</span>
              </div> */}
              <div className={MAnalysis.menuDetailPageDwellTime}>
                <p>총 체류시간</p>
                <div className={MAnalysis.barChartWithAvg2}>
                  <BarChartWithAvg data={menuDetailDwellTime} />
                </div>
                {/* <span>{duration} 초</span> */}
              </div>
            </div>
            <div className={MAnalysis.menuDetailOrderRatio}>
              <p>방문 대비 판매 건수</p>
              <div className={MAnalysis.vBarChart}>
                <VerticalBarChart chartData={salesPerVisitData} />
              </div>
              {/* <span>{salesPerVisit} %</span> */}
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
            <div className={MAnalysis.menuDetailPageGazeBody}>
              <img src={menuDetailPage} alt="menuDetailPage" />
              <div className={MAnalysis.detailDiv}>
                <p>메뉴 이름: {fixDataInDetail.name} %</p>
                <p>메뉴 이미지: {fixDataInDetail.image} %</p>
                <p>메뉴 정보: {fixDataInDetail.info} %</p>
                <p>메뉴 가격: {fixDataInDetail.price} %</p>
                <p>그 외: {fixDataInDetail.etc} %</p>
              </div>
            </div>
            {/* <div className={MAnalysis.menuDetailPageGazeBody}> */}
            {/* </div> */}
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
