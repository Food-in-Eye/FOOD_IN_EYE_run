import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text,
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
        >{`메뉴: ${label}`}</p>
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

function BarChartWithAvg({ data }) {
  /** duration type: string -> float */
  data.forEach((item) => {
    item.duration = parseFloat(item.duration);
  });

  const totalDuration = data.reduce((sum, item) => sum + item.duration, 0);
  const averageDuration = totalDuration / data.length;

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar
        dataKey="duration"
        fill="#8884d8"
        name="메뉴별 체류시간"
        barSize={30}
      />
      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
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
