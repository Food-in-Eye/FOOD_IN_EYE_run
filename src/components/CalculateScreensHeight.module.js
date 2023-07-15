function CalculateHeight(data) {
  if (!data || data.length === 0) return 0;

  const minY = Math.min(...data.map((point) => point.y));
  const maxY = Math.max(...data.map((point) => point.y));
  const distance = maxY - minY;
  const padding = distance * 0.2; // 20% 여백 추가
  const calculatedHeight = distance + padding;

  return calculatedHeight;
}

export default CalculateHeight;
