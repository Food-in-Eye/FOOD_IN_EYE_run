import React from "react";

function CircleWithText({ radius, text, strokeColor }) {
  const circleStyle = {
    fill: "none",
    stroke: strokeColor,
    strokeWidth: 5,
  };

  const textStyle = {
    fontSize: "25px",
    fontWeight: "bold",
    fill: "black",
    textAnchor: "middle",
    dominantBaseline: "middle",
  };

  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle cx={radius} cy={radius} r={radius - 2} style={circleStyle} />
      <text x={radius} y={radius} style={textStyle}>
        {text}
      </text>
    </svg>
  );
}

export default CircleWithText;
