import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

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
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "18px",
            fontFamily: "NotoSansKR-Regular",
          }}
        >{`메뉴: ${payload[0].payload.name}`}</p>
        <p
          style={{
            width: "auto",
            backgroundColor: "#fff",
            padding: "2px",
            fontSize: "18px",
            fontFamily: "NotoSansKR-Regular",
          }}
        >{`체류시간: ${payload[0].value} 초`}</p>
      </div>
    );
  }

  return null;
};

function BarChartWithAvg({ data, index }) {
  /** duration type: string -> float */

  data.forEach((item, i) => {
    item.duration = parseFloat(item.duration);
    item.fill = index === i ? "#1e2f4d" : "#c0c0c0";
  });

  const totalDuration = data.reduce((sum, item) => sum + item.duration, 0);
  const averageDuration = totalDuration / data.length;

  return (
    <BarChart
      width={800}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={(item) => `Food ${item.index + 1}`} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="duration" fill="fill" name="메뉴별 체류시간" barSize={30} />
      <ReferenceLine
        y={averageDuration}
        label={{
          position: "right",
          value: `평균 체류시간: ${averageDuration.toFixed(2)}`,
          fill: "red",
          fontsize: 14,
          fontWeight: "bold",
        }}
        stroke="red"
        strokeDasharray="3 3"
        strokeWidth={3}
      />
    </BarChart>
  );
}

export default BarChartWithAvg;
