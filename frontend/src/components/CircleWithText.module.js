import React from "react";

function CircleWithText({ radius, text, strokeColor }) {
  const circleStyle = {
    fill: "none",
    stroke: strokeColor,
    strokeWidth: 5,
  };

  const textStyle = {
    fontFamily: "Hahmlet-SemiBold",
    fontSize: "25px",
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
