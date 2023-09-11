import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import SemiCircle from "../css/SemiCircleGaugeChart.module.css";

function SemiCircleGaugeChart() {
  const data = [
    {
      name: "Gauge",
      innerRadius: "60%",
      outerRadius: "80%",
      value: 75, // 게이지 값 (0 ~ 100 범위)
      minValue: 0, // 최소값
      maxValue: 100, // 최대값
    },
  ];

  const calculateBarData = (value, minValue, maxValue) => {
    // 게이지 값이 최소값 미만이거나 최대값 초과 시 보정
    if (value < minValue) {
      value = minValue;
    } else if (value > maxValue) {
      value = maxValue;
    }

    // 각도 계산
    const angle = (value / (maxValue - minValue)) * 180;

    return [{ value: angle }];
  };

  return (
    <div className={SemiCircle.semiCircleGaugeChartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          width={300}
          height={300}
          innerRadius="10%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={0}
          cy="50%"
        >
          <RadialBar
            dataKey="value"
            cornerRadius="50%"
            fill="#8884d8"
            data={calculateBarData(
              data[0].value,
              data[0].minValue,
              data[0].maxValue
            )}
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SemiCircleGaugeChart;
