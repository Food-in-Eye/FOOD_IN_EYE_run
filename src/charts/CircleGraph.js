import { useState, useEffect } from "react";

const CircleGraph = ({ data }) => {
  // 최소 및 최대 값 계산
  const minValue = Math.min(
    ...data.map((item) => item.fixation_count / item.gaze_count)
  );
  const maxValue = Math.max(
    ...data.map((item) => item.fixation_count / item.gaze_count)
  );

  console.log(data);
  console.log(minValue, maxValue, "!!!");

  // 각 음식 항목을 정규화하여 percentages 배열에 저장
  const percentages = data.map((item) => {
    const normalizedValue =
      ((item.fixation_count / item.gaze_count - minValue) /
        (maxValue - minValue)) *
      100;
    return normalizedValue;
  });

  console.log("percentages", percentages);

  // Fixation 값을 화살표로 가리키는 위치 계산 -> Food 6
  const foodIndex = data.findIndex((item) => item.name === "Food 6");
  const arrowAngle = percentages[foodIndex] * 3.6;

  const [angles, setAngles] = useState([]);

  useEffect(() => {
    const initialAngles = percentages.map(() => [0, 0]); // 초기 각도 배열 생성
    setAngles(initialAngles); // 초기 각도 배열로 설정
  }, []);

  useEffect(() => {
    if (angles.length === 0) {
      return; // angles 배열이 초기화되지 않았다면 계산하지 않음
    }

    const calculatedAngles = percentages.map((percentage, index) => {
      const previousAngle = index === 0 ? [0, 0] : angles[index - 1];
      const startAngle = previousAngle[1];
      const endAngle = startAngle + (percentage / 100) * 360;
      return [startAngle, endAngle];
    });
    setAngles(calculatedAngles);
  }, [percentages, angles]);

  // 원호 경로 생성 함수
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  console.log("arrowAngle", arrowAngle);

  return (
    <svg width="300" height="300">
      <circle cx="150" cy="150" r="100" fill="lightgray" />
      {angles.map(([startAngle, endAngle], index) => (
        <path
          key={index}
          d={describeArc(150, 150, 100, startAngle, endAngle)}
          fill={`hsl(${index * (360 / angles.length)}, 50%, 50%)`}
        />
      ))}
      <line
        x1="150"
        y1="150"
        x2={150 + 80 * Math.cos((arrowAngle - 90) * (Math.PI / 180))}
        y2={150 + 80 * Math.sin((arrowAngle - 90) * (Math.PI / 180))}
        stroke="red"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="10"
        refX="5"
        refY="5"
        orient="auto"
      >
        <polygon points="0 0, 10 5, 0 10" fill="red" />
      </marker>
    </svg>
  );
};

export default CircleGraph;
