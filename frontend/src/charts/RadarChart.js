import { getFoods, getMenus, getStore } from "../components/API.module";
import { useCallback, useState, useEffect, useRef } from "react";
import MChart from "../css/MenuChart.module.css";
import dailyReport from "../data/daily_report.json";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";

const getUnit = (value) => {
  switch (value) {
    case "visitCount":
      return "건";
    case "totalCount":
      return "개";
    case "totalSales":
      return "원";
    case "dwellTime":
      return "초";
    case "score":
      return "점";
    default:
      return "";
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const metric = payload[0].dataKey;
    const unit = getUnit(metric);
    return (
      <div className="custom-tooltip">
        <p
          className="label"
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "8px",
            border: "1px solid #8d8d8d",
          }}
        >{`${label} : ${payload[0].value} ${unit}`}</p>
        {/* 이곳에 원하는 Tooltip 내용을 추가하세요 */}
      </div>
    );
  }

  return null;
};

// 커스텀 Legend 컴포넌트
const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="custom-legend">
      {payload.map((entry, index) => (
        <h3
          key={`item-${index}`}
          style={{ color: entry.color, textAlign: "center" }}
        >
          {entry.value}
        </h3>
      ))}
    </div>
  );
};

function RadarChart() {
  const sID = "64a2d45c1fe80e3e4db82af9";
  const [foodCount, setFoodCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [foodDataArray, setFoodDataArray] = useState([]);

  const aoiData = dailyReport["Store 1"].aoi_summary.total_food_report;
  const saleData = dailyReport["Store 1"].sale_summary.food_detail;

  const radarChartsRef = useRef(null);

  const handleMetricChange = (metric) => {
    if (selectedMetrics.includes(metric)) {
      // Deselect the metric
      setSelectedMetrics(selectedMetrics.filter((item) => item !== metric));
    } else {
      // Select the metric
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const getMenuItems = useCallback(async () => {
    try {
      const resStore = await getStore(sID);
      const mID = resStore.data.m_id;
      const resMenu = await getMenus(`/menu/foods?id=${mID}`);
      const resFood = await getFoods(sID);

      if (resMenu && resMenu.data && resMenu.data.f_list) {
        setMenuItems(resMenu.data.f_list);
      } else {
        setMenuItems([]);
      }

      setFoodCount(resFood.data.food_list.length);
    } catch (error) {
      console.error(`menu-items GET error: ${error}`);
    }
  }, [sID, setMenuItems]);

  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    const dataArray = [];

    for (const foodName in aoiData) {
      if (
        aoiData.hasOwnProperty(foodName) &&
        foodName !== "ETC" &&
        foodName !== "Store INFO"
      ) {
        const foodData = aoiData[foodName];
        const inDetail = foodData.in_detail || {};
        const visitCount = foodData.visit_count + (inDetail.visit || 0);
        const dwellTime = (foodData.duration + (inDetail.duration || 0)) / 1000;
        const score = foodData.score;

        let orderCount = 0;
        let saleCount = 0;

        for (const fieldName in saleData) {
          if (fieldName === foodName) {
            orderCount = saleData[fieldName].total_count;
            saleCount = saleData[fieldName].total_sales;

            break;
          }
        }

        const menuItem = menuItems[parseInt(foodName.split(" ")[1]) - 1];

        dataArray.push({
          subject: menuItem ? menuItem.name : foodName,
          visitCount: visitCount,
          dwellTime: parseFloat(dwellTime.toFixed(1)),
          score: score,
          totalSales: saleCount,
          totalCount: orderCount,
          // fullMark:
        });
      }
    }
    console.log("dataArray", dataArray);
    setFoodDataArray(dataArray);
  }, [aoiData, saleData, menuItems]);

  console.log("menuItems", menuItems);
  console.log("foodDataArray", foodDataArray);

  const metricsOrder = [
    { metric: "visitCount", displayName: "총 방문 수" },
    { metric: "totalCount", displayName: "총 판매량" },
    { metric: "totalSales", displayName: "총 판매금액" },
    { metric: "dwellTime", displayName: "체류시간" },
    { metric: "score", displayName: "집중도" },
  ];

  useEffect(() => {
    if (selectedMetrics.length > 2 && radarChartsRef.current) {
      radarChartsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedMetrics]);

  return (
    <div className={MChart.total}>
      <div className={MChart.checkboxButtons} ref={radarChartsRef}>
        {metricsOrder.map((item) => (
          <label key={item.metric}>
            <input
              type="checkbox"
              value={item.metric}
              checked={selectedMetrics.includes(item.metric)}
              onChange={() => handleMetricChange(item.metric)}
            />
            {item.displayName}
          </label>
        ))}
      </div>
      <div className={MChart.radarCharts}>
        {selectedMetrics.length <= 2 ? (
          // 3개 이하의 metric을 선택한 경우
          selectedMetrics.map((metric) => (
            <div key={metric} className={MChart.radarChart}>
              <RadarChart
                outerRadius={150}
                width={500}
                height={500}
                data={foodDataArray}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Legend content={<CustomLegend />} />
                <Radar
                  name={
                    metricsOrder.find((item) => item.metric === metric)
                      .displayName
                  }
                  dataKey={metric}
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </div>
          ))
        ) : (
          // 4개 이상의 metric을 선택한 경우
          <div className={MChart.radarChartGroup}>
            {selectedMetrics.map((metric) => (
              <div key={metric} className={MChart.radarChart}>
                <RadarChart
                  outerRadius={150}
                  width={500}
                  height={500}
                  data={foodDataArray}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Legend content={<CustomLegend />} />
                  <Radar
                    name={
                      metricsOrder.find((item) => item.metric === metric)
                        .displayName
                    }
                    dataKey={metric}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RadarChart;
