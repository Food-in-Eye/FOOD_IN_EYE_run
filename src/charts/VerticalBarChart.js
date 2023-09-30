import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const getUnit = (value) => {
  switch (value) {
    case "mc":
      return "건";
    case "vc":
      return "회";
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
        {payload.map((entry) => {
          const unit = getUnit(entry.dataKey);
          return (
            <p
              key={entry.dataKey}
              className="label"
              style={{
                width: "auto",
                backgroundColor: "#fff",
                padding: "2px",
                fontSize: "18px",
                fontFamily: "NotoSansKR-Regular",
              }}
            >{`${entry.name}: ${entry.value} ${unit}`}</p>
          );
        })}
      </div>
    );
  }

  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="custom-legend">
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="legend-item"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "0px",
            padding: "5px",
          }}
        >
          <div
            className="legend-color"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              fontSize: "15px",
              fontFamily: "NotoSansKR-Regular",
              backgroundColor: entry.color,
            }}
          ></div>
          <div className="legend-label">
            {entry.value} (단위: {getUnit(entry.dataKey)})
          </div>
        </div>
      ))}
    </div>
  );
};

function VerticalBarChart({ chartData }) {
  const data = [
    {
      name: "",
      mc: chartData.menuSalesCount,
      vc: chartData.visitCount,
    },
  ];

  console.log("data", data);

  return (
    <div>
      <ComposedChart
        layout="vertical"
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" scale="band" />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="mc" barSize={20} fill="#1e2f4d" name="판매 개수" />
        <Bar dataKey="vc" barSize={20} fill="#feb930" name="방문 횟수" />
      </ComposedChart>
    </div>
  );
}

export default VerticalBarChart;
