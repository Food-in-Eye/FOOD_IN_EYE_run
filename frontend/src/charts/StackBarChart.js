import stacks from "../css/StackBarChart.module.css";

function StackBarChart({ fixData }) {
  const fixDataKeys = Object.keys(fixData);
  const fixDataValues = Object.values(fixData);
  const totalSum = Object.values(fixData).reduce((acc, val) => acc + val, 0);

  return (
    <div className={stacks.row}>
      {fixDataValues.map((value, index) => {
        // 각 칸의 비율 계산
        const percentage = (value / totalSum) * 100;

        if (percentage !== 0) {
          return (
            <div
              key={index}
              className={stacks.column}
              style={{ width: "100%", height: "40px" }}
            >
              <div
                className={stacks.stackBar}
                style={{ width: `${percentage}%`, height: "100%" }}
              ></div>
              <div className={stacks.percentageText}>
                <p>
                  {fixDataKeys[index]}
                  <br />
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default StackBarChart;
