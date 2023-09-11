function BarGraph({ data }) {
  // 각 부분에 대한 비율을 계산합니다.
  const total = data.reduce((acc, val) => acc + val, 0); // 총 시선 수 계산
  const ratios = data.map((value) => (value / total) * 100); // 비율 계산 (퍼센트)

  return (
    <div className="bar-graph">
      {ratios.map((ratio, index) => (
        <div key={index} className="bar" style={{ height: `${ratio}%` }}>
          {`${data[index]} %`}
        </div>
      ))}
    </div>
  );
}

export default BarGraph;
