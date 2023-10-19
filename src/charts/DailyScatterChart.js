import { useEffect, useState } from "react";
import dailyReport from "../data/daily_report.json";
import SChart from "../css/ScatterChart.module.css";
import { getFoods } from "../components/API.module";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

// const data = [
//   { x: 100, y: 200, z: 200 },
//   { x: 120, y: 100, z: 260 },
//   { x: 170, y: 300, z: 400 },
//   { x: 140, y: 250, z: 280 },
//   { x: 150, y: 400, z: 500 },
//   { x: 110, y: 280, z: 200 },
// ];

function DailyScatterChart(data) {
  const sID = "64a2d45c1fe80e3e4db82af9";

  console.log("data", data);

  const aoiData = data.data.aoi_summary.total_food_report;
  const saleData = data.data.sale_summary.food_detail;
  const [fNameList, setFNameList] = useState([]);

  const [xAxisType, setXAxisType] = useState("fixCount");
  const [xAxisLabel, setXAxisLabel] = useState("시선 수");

  const handleXAxisChange = (e) => {
    const newXAxisType = e.target.value;

    setXAxisType(newXAxisType);
    setXAxisLabel(newXAxisType === "fixCount" ? "시선 수" : "체류 시간");
  };

  useEffect(() => {
    const getFName = async () => {
      const res = await getFoods(sID);
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
        foodName !== "Store INFO"
      ) {
        const foodData = aoiData[foodName];
        const fixCount = foodData.fix_count;
        const duration = (foodData.duration / 1000).toFixed(2);

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
          // name: fNameList[foodDataArray.length],
          // totalSales: totalSales,
          x: xAxisType === "fixCount" ? fixCount : duration,
          y: totalCount,
          // fillColor: "#1e2f4d",
        });
      }
    }

    setGraphData(foodDataArray);
  }, [xAxisType, aoiData, saleData, fNameList]);

  const [graphData, setGraphData] = useState([]);

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
          체류 시간
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 30,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel}
            // unit={xAxisType === "fixCount" ? "" : "초"}
          >
            <Label
              value={
                xAxisLabel === "시선 수" ? "시선 수" : "체류시간(단위: 초)"
              }
              offset={-15}
              position="insideBottom"
            />
          </XAxis>
          <YAxis type="number" dataKey="y" name="주문량">
            <Label
              value="주문량(단위: 건)"
              offset={15}
              position="insideLeft"
              angle={-90}
            />
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="A school" data={graphData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyScatterChart;
