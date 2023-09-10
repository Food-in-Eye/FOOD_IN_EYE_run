import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import dailyReport from "../data/daily_report.json";
import SChart from "../css/ScatterChart.module.css";
import { getFoods } from "../components/API.module";
import { fn } from "moment";

function ScatterChart() {
  const aoiData = dailyReport["Store 1"].aoi_summary.total_food_report;
  const saleData = dailyReport["Store 1"].sale_summary.food_detail;
  const [fNameList, setFNameList] = useState([]);

  const [xAxisType, setXAxisType] = useState("fixCount");

  const handleXAxisChange = (e) => {
    setXAxisType(e.target.value);
  };

  useEffect(() => {
    const getFName = async () => {
      const res = await getFoods("64a2d45c1fe80e3e4db82af9");
      const foodNames = res.data.food_list.map((food) => food.name);
      setFNameList(foodNames);
    };
    getFName();
  }, [saleData]);

  useEffect(() => {
    const foodDataArray = [];

    for (const foodName in aoiData) {
      if (
        aoiData.hasOwnProperty(foodName) &&
        foodName !== "ETC" &&
        foodName !== "STORE INFO"
      ) {
        const foodData = aoiData[foodName];
        const fixCount = foodData.fix_count;
        const duration = foodData.duration;

        let totalCount = 0;
        let totalSales = 0;

        for (const fieldName in saleData) {
          if (fieldName === foodName) {
            totalCount = saleData[fieldName].total_count;
            totalSales = saleData[fieldName].total_sales;

            break;
          }
        }

        foodDataArray.push({
          name: fNameList[foodDataArray.length],
          totalSales: totalSales,
          x: xAxisType === "fixCount" ? fixCount : duration,
          y: totalCount,
        });
      }
    }
    console.log(foodDataArray);

    setGraphData(foodDataArray);
  }, [xAxisType, aoiData, saleData, fNameList]);

  const [graphData, setGraphData] = useState([]);

  const options = {
    chart: {
      type: "scatter",
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      title: {
        text: xAxisType === "fixCount" ? "시선 수(단위: 수)" : "시간(단위: 분)",
      },
    },
    yaxis: {
      title: {
        text: "주문량(단위: 건)",
      },
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const foodData = graphData[dataPointIndex];
        let html = `<div className={SChart.customTooltip}>`;
        html += `<div><strong>${foodData.name}</strong></div>`;
        html += `<div>주문량: ${foodData.y} 건</div>`;
        html += `<div>총 주문 금액: ${foodData.totalSales} 원</div>`;
        html += `</div>`;
        return html;
      },
    },
  };

  return (
    <div className={SChart.total}>
      <div className={SChart.radioButtons}>
        <label>
          <input
            type="radio"
            value="fixCount"
            checked={xAxisType === "fixCount"}
            onChange={handleXAxisChange}
          />
          시선 수
        </label>
        <label>
          <input
            type="radio"
            value="duration"
            checked={xAxisType === "duration"}
            onChange={handleXAxisChange}
          />
          Duration
        </label>
      </div>

      <div className={SChart.charts}>
        <ReactApexChart
          options={options}
          series={[{ name: "Food Data", data: graphData }]}
          type="scatter"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}

export default ScatterChart;
