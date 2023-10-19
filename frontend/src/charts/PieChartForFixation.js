import { useCallback, useState } from "react";
import { PieChart, Pie, Sector } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 }
// ];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    active,
    index,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  const sectorFill = active ? "#6f81a0" : fill;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={sectorFill}
        style={{ fontSize: "18px", fontWeight: "bold" }}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={sectorFill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={sectorFill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={sectorFill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={sectorFill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${payload.name}의 시선 수: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

function PieChartForFixation({ data, fNum }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const fNumWithNoFood = parseInt(fNum.replace("Food", "")) - 1;
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const coloredData = data.map((item, index) => {
    return {
      ...item,
      fill: item.index === fNumWithNoFood ? "#3c485d" : "#c0c0c0",
    };
  });

  return (
    <PieChart width={700} height={300}>
      <Pie
        activeIndex={activeIndex}
        activeShape={(props) => renderActiveShape({ ...props, active: true })}
        data={coloredData}
        cx={350}
        cy={150}
        innerRadius={80}
        outerRadius={100}
        fill="#1e2f4d"
        dataKey="value"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
  );
}

export default PieChartForFixation;
