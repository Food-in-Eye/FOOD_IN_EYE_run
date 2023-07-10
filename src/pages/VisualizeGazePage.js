import MenuBar from "../components/MenuBar";
import VisualizeGaze from "../css/VisualizeGaze.module.css";
import gazeData from "../data/gaze_data.json";
import heatmap from "heatmap.js";

import { useRef, useState, useEffect } from "react";

function VisualizeGazePage() {
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    // heatmap.js 설정 및 초기화
    const heatmapInstance = heatmap.create({
      container: canvasRef.current,
    });

    const curUseData = gazeData[0].gaze;

    const heatmapData = processHeatmapData(curUseData);
    heatmapInstance.setData(heatmapData);

    // 히트맵 렌더링하고 캔버스에 표시
    heatmapInstance.repaint();
    // 캔버스 높이 계산
    calculateCanvasHeight(curUseData);

    console.log(canvasRef.current);
  }, []);

  //캔버스 높이 계산
  const calculateCanvasHeight = (rawData) => {
    const minY = Math.min(...rawData.map((point) => point.y));
    const maxY = Math.max(...rawData.map((point) => point.y));
    const distance = maxY - minY;
    const padding = distance * 0.2; // 20% 여백 추가
    const calculatedHeight = distance + padding;

    setCanvasHeight(calculatedHeight);
  };

  const processHeatmapData = (rawData) => {
    console.log(rawData);
    console.log(rawData[0]);

    const heatmapData = {
      max: 1,
      data: [],
    };

    for (let i = 0; i < rawData.length - 1; i++) {
      const { x, y, t } = rawData[i];
      const nextT = rawData[i + 1].t;
      const value = nextT - t; // timestamp의 간격

      heatmapData.data.push({
        x,
        y,
        value,
      });
    }

    console.log(heatmapData);
    return heatmapData;
  };

  return (
    <div>
      <MenuBar />
      <div>
        <h3>store_list heatmap</h3>
        <canvas ref={canvasRef} width="285" height={canvasHeight} />
      </div>
    </div>
  );
}

export default VisualizeGazePage;
