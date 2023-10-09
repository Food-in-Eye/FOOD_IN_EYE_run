import { PieChart, Pie, Cell, Label } from "recharts";

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 200;
const iR = 50;
const oR = 100;

const needle = (fc, gc, cx, cy, iR, oR, color) => {
  const total = gc;
  const ang = 180.0 * (1 - fc / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      key="path"
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ];
};

function PieChartWithNeedle({ fc, gc }) {
  const data = [
    {
      name: "A",
      value: fc,
      color: "#8884d8",
    },
  ];

  return (
    <PieChart width={400} height={300}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={data}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        fill="#8884d8"
        stroke="none"
      >
        <Label
          value={`전체 시선 수: ${gc}`}
          position="outsideBottom"
          dy={100}
          style={{ fontSize: "16px", fontWeight: "bold" }}
          fill="#8884d8"
        />
        <Label
          value={`Fixation 수: ${fc}`}
          position="outsideBottom"
          dy={120}
          style={{ fontSize: "16px", fontWeight: "bold" }}
          fill="#d0d000"
        />
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>

      {needle(fc, gc, cx, cy, iR, oR, "#d0d000")}
    </PieChart>
  );
}

export default PieChartWithNeedle;
