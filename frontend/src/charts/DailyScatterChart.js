import { useEffect, useState } from "react";
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

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          width: "auto",
          backgroundColor: "#fff",
          padding: "2px 0px",
          textAlign: "left",
          border: "1px solid #d2d2d2",
        }}
      >
        <p
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "15px",
            fontFamily: "NotoSansKR-SemiBold",
          }}
        >{`메뉴명: ${data.name}`}</p>
        <p
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "13px",
            fontFamily: "NotoSansKR-SemiBold",
          }}
        >{`체류 시간(단위: 초): ${data.x}`}</p>
        <p
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "13px",
            fontFamily: "NotoSansKR-SemiBold",
          }}
        >{`주문량(단위: 건): ${data.y}`}</p>
      </div>
    );
  }

  return null;
}

function DailyScatterChart({ data }) {
  const sID = localStorage.getItem("s_id");
  console.log("data", data);

  const aoiData = data.aoi_summary.total_food_report;
  const saleData = data.sale_summary.food_detail;
  const [fNameList, setFNameList] = useState([]);

  const xAxisType = "duration";
  const xAxisLabel = "체류 시간";

  // const handleXAxisChange = (e) => {
  //   const newXAxisType = e.target.value;

  //   setXAxisType(newXAxisType);
  //   setXAxisLabel(newXAxisType === "체류 시간");
  // };

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
        console.log("foodName", foodName);
        const foodData = aoiData[foodName];
        const foodIndex = parseInt(foodName.replace("Food ", "")) - 1;
        console.log("fNameList", fNameList);
        const foodNameFromFNameList = fNameList[foodIndex];
        console.log("foodNameFromFNameList", foodNameFromFNameList);

        const duration = (foodData.duration / 1000).toFixed(2);

        let totalCount = 0;

        for (const fieldName in saleData) {
          if (fieldName === foodName) {
            totalCount = saleData[fieldName].total_count;
            break;
          }
        }

        foodDataArray.push({
          name: foodNameFromFNameList,
          x: duration,
          y: totalCount,
        });
      }
    }

    setGraphData(foodDataArray);
  }, [xAxisType, aoiData, saleData, fNameList]);

  const [graphData, setGraphData] = useState([]);

  return (
    <div className={SChart.total}>
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
          <XAxis type="number" dataKey="x" name={xAxisLabel}>
            <Label
              value="체류시간(단위: 초)"
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
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={CustomTooltip}
          />
          <Scatter name="Report" data={graphData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyScatterChart;
