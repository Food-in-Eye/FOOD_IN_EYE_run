function CalculateHeight(data) {
  if (!data || data.length === 0) return 0;

  // console.log(data);
  const minY = Math.min(
    ...data.flatMap((item) => item.gaze.map((point) => point.y))
  );
  const maxY = Math.max(
    ...data.flatMap((item) => item.gaze.map((point) => point.y))
  );
  const distance = maxY - minY;
  const padding = distance * 0.2; // 20% 여백 추가
  const calculatedHeight = distance + padding;

  return calculatedHeight;
}

export default CalculateHeight;
