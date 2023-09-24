import dailyReport from "../data/daily_report.json";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const getUnit = (value) => {
  switch (value) {
    case "oc":
      return "건";
    case "dt":
      return "초";
    default:
      return "";
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          width: "auto",
          backgroundColor: "#fff",
          padding: "2px 0px",
          textAlign: "left",
          border: "1px solid #8d8d8d",
        }}
      >
        <p
          className="label"
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "5px",
            fontSize: "18px",
            fontFamily: "NotoSansKR-Bold",
          }}
        >{`${label}`}</p>
        {payload.map((entry) => {
          const unit = getUnit(entry.dataKey);
          return (
            <p
              key={entry.dataKey}
              className="label"
              style={{
                width: "auto",
                backgroundColor: "#fff",
                padding: "3px",
                color: "#323232",
                fontSize: "15px",
                fontFamily: "NotoSansKR-SemiBold",
              }}
            >{`${entry.name}: ${entry.value} ${unit}`}</p>
          );
        })}
      </div>
    );
  }

  return null;
};

function BarChart() {
  const hourlySaleInfo = dailyReport["Store 1"].sale_summary.hourly_sale_info;
  //   const timeLabels = hourlySaleInfo.map((hourData, index) => `${index}시`);
  //   const orderCounts = hourlySaleInfo.map((hourData) => hourData.order);
  //   const dwellTimes = hourlySaleInfo.map((hourData) => hourData.dwell_time);

  const data = hourlySaleInfo.map((hourData, index) => ({
    name: `${index}시`,
    oc: hourData.order,
    dt: hourData.dwell_time / 1000,
  }));

  return (
    <div>
      <ComposedChart
        width={1500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 80,
          bottom: 20,
          left: 20,
        }}
        backgroundColor="#d2d2d2"
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="name"
          label={{
            value: "시간대",
            position: "insideBottomRight",
            offset: 0,
          }}
          scale="band"
        />
        <YAxis
          yAxisId="left"
          label={{
            value: "주문량(단위: 건)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: "체류시간(단위: 초)",
            angle: -90,
            position: "insideRight",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="oc"
          barSize={20}
          fill="#1e2f4d"
          name="주문량"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="dt"
          stroke="#feb930"
          strokeWidth={3}
          name="체류시간"
        />
      </ComposedChart>
    </div>
  );
}

export default BarChart;
