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
          border: "1px solid #d2d2d2",
        }}
      >
        <p
          className="label"
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "12px",
            fontFamily: "NotoSansKR-SemiBold",
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
                fontSize: "12px",
                fontFamily: "NotoSansKR-Light",
              }}
            >{`${entry.name}: ${entry.value} ${unit}`}</p>
          );
        })}
      </div>
    );
  }

  return null;
};

function BarChart({ data }) {
  const hourlySaleInfo = data.sale_summary.hourly_sale_info;
  const hourlyDwellTime = data.aoi_summary.hourly_dwell_time;

  console.log("hourlySaleInfo", hourlySaleInfo);

  const chartData = hourlySaleInfo.map((hourData, index) => ({
    name: `${index}시`,
    oc: hourData.order,
    dt: (hourlyDwellTime[index] / 1000).toFixed(1),
  }));

  return (
    <div>
      <ComposedChart
        width={1500}
        height={400}
        data={chartData}
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
          yAxisId="right"
          dataKey="dt"
          barSize={20}
          fill="#1e2f4d"
          name="체류시간"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="oc"
          stroke="#feb930"
          strokeWidth={3}
          name="주문량"
        />
      </ComposedChart>
    </div>
  );
}

export default BarChart;
